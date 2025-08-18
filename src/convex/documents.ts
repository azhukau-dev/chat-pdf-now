import { v } from 'convex/values';

import { authMutation, authQuery } from './util';

export const generateUploadUrl = authMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendDocument = authMutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    size: v.number(),
  },
  handler: async (ctx, { name, storageId, size }) => {
    const { user } = ctx;
    await ctx.db.insert('documents', {
      name,
      storageId,
      userId: user._id,
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

export const deleteDocument = authMutation({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, { documentId }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    await ctx.storage.delete(document.storageId);
    await ctx.db.delete(documentId);
  },
});
