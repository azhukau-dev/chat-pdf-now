import { openai } from '@ai-sdk/openai';
import { RAG } from '@convex-dev/rag';
import { v } from 'convex/values';

import { components, internal } from './_generated/api';
import { internalMutation, internalQuery } from './_generated/server';
import { authAction, authMutation, authQuery } from './util';

export const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding('text-embedding-3-small'),
  embeddingDimension: 1536,
});

export const generateUploadUrl = authMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendDocument = authAction({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    size: v.number(),
    text: v.string(),
  },
  handler: async (ctx, { name, storageId, size, text }) => {
    const { user } = ctx;
    const documentId = await ctx.runMutation(
      internal.documents.insertDocument,
      {
        name,
        storageId,
        userId: user._id,
        size,
      },
    );
    await rag.add(ctx, {
      namespace: user._id,
      key: documentId,
      text,
    });
  },
});

export const insertDocument = internalMutation({
  args: {
    name: v.string(),
    storageId: v.id('_storage'),
    userId: v.id('users'),
    size: v.number(),
  },
  handler: async (ctx, { name, storageId, userId, size }) => {
    return await ctx.db.insert('documents', {
      name,
      storageId,
      userId,
      size,
    });
  },
});

export const getDocuments = authQuery({
  handler: async (ctx) => {
    const { user } = ctx;
    return await ctx.db
      .query('documents')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});

export const deleteDocument = authAction({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, { documentId }) => {
    const { user } = ctx;
    const document = await ctx.runQuery(internal.documents.getDocumentRecord, {
      documentId,
    });
    if (!document) {
      throw new Error('Document not found');
    }

    await ctx.runMutation(internal.documents.deleteDocumentRecord, {
      documentId,
      storageId: document.storageId,
    });

    await rag.deleteByKey(ctx, {
      namespaceId: user._id,
      key: documentId,
    });
  },
});

export const deleteDocumentRecord = internalMutation({
  args: {
    documentId: v.id('documents'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { documentId, storageId }) => {
    await ctx.storage.delete(storageId);
    await ctx.db.delete(documentId);
  },
});

export const getDocumentUrl = authQuery({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, { documentId }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    return await ctx.storage.getUrl(document.storageId);
  },
});

export const getDocumentRecord = internalQuery({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});
