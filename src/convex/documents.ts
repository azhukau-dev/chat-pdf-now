import { vEntryId } from '@convex-dev/rag';
import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';
import * as Agent from './model/agent';
import * as Auth from './model/auth';
import * as Documents from './model/documents';
import * as Rag from './model/rag';
import * as Users from './model/users';

export const updateDocumentWithThreadAndRagEntry = internalMutation({
  args: {
    documentId: v.id('documents'),
    agentThreadId: v.string(),
    ragEntryId: vEntryId,
  },
  handler: async (ctx, { documentId, agentThreadId, ragEntryId }) => {
    await Documents.updateDocument(ctx, documentId, {
      agentThreadId,
      ragEntryId,
    });
  },
});

export const addDocumentEmbedding = internalAction({
  args: {
    userId: v.id('users'),
    documentId: v.id('documents'),
    text: v.string(),
  },
  handler: async (ctx, { userId, documentId, text }) => {
    return await Rag.addDocumentEmbedding(ctx, {
      userId,
      documentId,
      text,
    });
  },
});

export const createAgentThread = internalMutation({
  handler: async (ctx) => {
    return await Agent.createThread(ctx);
  },
});

export const cleanupDocumentResources = internalAction({
  args: {
    ragEntryId: vEntryId,
    agentThreadId: v.string(),
  },
  handler: async (ctx, { ragEntryId, agentThreadId }) => {
    await Rag.deleteDocumentEmbedding(ctx, ragEntryId);
    await Agent.deleteThread(ctx, agentThreadId);
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
        userId,
        documentId,
        text,
      },
    );
    await ctx.runMutation(
      internal.documents.updateDocumentWithThreadAndRagEntry,
      {
        documentId,
        agentThreadId,
        ragEntryId,
      },
    );
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
      agentThreadId: null,
      ragEntryId: null,
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

    await Documents.deleteDocument(ctx, documentId, document.storageId);
    await ctx.scheduler.runAfter(
      0,
      internal.documents.cleanupDocumentResources,
      {
        ragEntryId: document.ragEntryId!,
        agentThreadId: document.agentThreadId!,
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
