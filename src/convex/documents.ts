import { vEntryId } from '@convex-dev/rag';
import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';
import * as Agent from './model/agent';
import * as Auth from './model/auth';
import * as Chats from './model/chats';
import * as Documents from './model/documents';
import * as Rag from './model/rag';
import * as Users from './model/users';

export const initializeChatForDocument = internalMutation({
  args: {
    documentId: v.id('documents'),
    agentThreadId: v.string(),
    ragEntryId: vEntryId,
  },
  handler: async (ctx, { documentId, agentThreadId, ragEntryId }) => {
    return await Chats.addChat(ctx, {
      documentId,
      agentThreadId,
      ragEntryId,
    });
  },
});

export const addDocumentEmbedding = internalAction({
  args: {
    namespace: v.string(),
    key: v.string(),
    text: v.string(),
  },
  handler: async (ctx, { namespace, key, text }) => {
    return await Rag.addEmbedding(ctx, {
      namespace,
      key,
      text,
    });
  },
});

export const createAgentThread = internalMutation({
  handler: async (ctx) => {
    return await Agent.createThread(ctx);
  },
});

export const deleteChatById = internalMutation({
  args: {
    chatId: v.id('chats'),
  },
  handler: async (ctx, { chatId }) => {
    await Chats.deleteChat(ctx, chatId);
  },
});

export const cleanupDocumentResources = internalAction({
  args: {
    chatId: v.id('chats'),
    ragEntryId: vEntryId,
    agentThreadId: v.string(),
  },
  handler: async (ctx, { chatId, ragEntryId, agentThreadId }) => {
    await Rag.deleteEmbedding(ctx, ragEntryId);
    await Agent.deleteThread(ctx, agentThreadId);
    await ctx.runMutation(internal.documents.deleteChatById, {
      chatId,
    });
  },
});

export const linkDocumentToChat = internalMutation({
  args: {
    documentId: v.id('documents'),
    chatId: v.id('chats'),
  },
  handler: async (ctx, { documentId, chatId }) => {
    await Documents.updateDocument(ctx, documentId, {
      chatId,
    });
  },
});

export const initializeDocumentChatSystem = internalAction({
  args: {
    documentId: v.id('documents'),
    userId: v.id('users'),
    text: v.string(),
  },
  handler: async (ctx, { documentId, userId, text }) => {
    const { threadId: agentThreadId } = await ctx.runMutation(
      internal.documents.createAgentThread,
    );
    const { entryId: ragEntryId } = await ctx.runAction(
      internal.documents.addDocumentEmbedding,
      {
        namespace: userId,
        key: documentId,
        text,
      },
    );
    const chatId = await ctx.runMutation(
      internal.documents.initializeChatForDocument,
      {
        documentId,
        agentThreadId,
        ragEntryId,
      },
    );
    await ctx.runMutation(internal.documents.linkDocumentToChat, {
      documentId,
      chatId,
    });
  },
});

export const generateFileUploadUrl = Auth.authMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const processUploadedDocument = Auth.authMutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    size: v.number(),
    text: v.string(),
  },
  handler: async (ctx, { name, storageId, size, text }) => {
    const user = await Users.getCurrentUserOrThrow(ctx);
    const documentId = await Documents.addDocument(ctx, {
      name,
      storageId,
      userId: user._id,
      size,
      chatId: null,
    });
    await ctx.scheduler.runAfter(
      0,
      internal.documents.initializeDocumentChatSystem,
      {
        documentId,
        userId: user._id,
        text,
      },
    );
  },
});

export const getUserDocuments = Auth.authQuery({
  handler: async (ctx) => {
    const user = await Users.getCurrentUserOrThrow(ctx);
    return await Documents.getDocuments(ctx, user._id);
  },
});

export const getDocumentById = Auth.authQuery({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, { documentId }) => {
    return await Documents.getDocument(ctx, documentId);
  },
});

export const deleteDocument = Auth.authMutation({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, { documentId }) => {
    const document = await Documents.getDocument(ctx, documentId);
    const chat = await Chats.getChat(ctx, document.chatId!);

    await Documents.deleteDocument(ctx, documentId, document.storageId);
    await ctx.scheduler.runAfter(
      0,
      internal.documents.cleanupDocumentResources,
      {
        chatId: chat._id,
        ragEntryId: chat.ragEntryId,
        agentThreadId: chat.agentThreadId,
      },
    );
  },
});

export const getDocumentDownloadUrl = Auth.authQuery({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, { documentId }) => {
    const document = await Documents.getDocument(ctx, documentId);
    return await ctx.storage.getUrl(document.storageId);
  },
});
