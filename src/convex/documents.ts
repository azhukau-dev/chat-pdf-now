import { v } from 'convex/values';

import { authMutation } from './util';

export const generateUploadUrl = authMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendDocument = authMutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
  },
  handler: async (ctx, { name, storageId }) => {
    const { user } = await ctx;
    await ctx.db.insert('documents', { name, storageId, userId: user._id });
  },
});
