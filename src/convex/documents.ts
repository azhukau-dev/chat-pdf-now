import { ConvexError, v } from 'convex/values';

import { mutation } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError('Not authenticated');
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendDocument = mutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
  },
  handler: async (ctx, { name, storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError('Not authenticated');
    }
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.insert('documents', { name, storageId, userId: user._id });
  },
});
