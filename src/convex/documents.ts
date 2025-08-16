import { v } from 'convex/values';

import { authMutation, authQuery } from './util';

export const generateUploadUrl = authMutation({
  handler: async (ctx) => {
    return ctx.storage.generateUploadUrl();
  },
});

export const sendDocument = authMutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
  },
  handler: async (ctx, { name, storageId }) => {
    const { user } = ctx;
    await ctx.db.insert('documents', { name, storageId, userId: user._id });
  },
});

export const getDocuments = authQuery({
  handler: async (ctx) => {
    const { user } = ctx;
    return ctx.db
      .query('documents')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id));
  },
});
