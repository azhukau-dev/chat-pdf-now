import { UserJSON } from '@clerk/backend';
import { Validator, v } from 'convex/values';

import { internalMutation, internalQuery } from './_generated/server';
import { authQuery, getCurrentUser } from './util';

export const current = authQuery({
  args: {},
  handler: async (ctx) => {
    return ctx.user;
  },
});

export const getByExternalId = internalQuery({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, { externalId }) => {
    return ctx.db
      .query('users')
      .withIndex('by_external_id', (q) => q.eq('externalId', externalId))
      .unique();
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    data: v.any() as Validator<UserJSON>,
  },
  handler: async (ctx, { data }) => {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
    };

    const user = await getCurrentUser(ctx);
    if (user === null) {
      await ctx.db.insert('users', userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await getCurrentUser(ctx);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Cannot delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});
