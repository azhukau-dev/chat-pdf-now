import { UserJSON } from '@clerk/backend';
import { Validator, v } from 'convex/values';

import { internalMutation } from './_generated/server';
import * as Auth from './model/auth';
import * as Users from './model/users';

export const current = Auth.authQuery({
  args: {},
  handler: async (ctx) => {
    return await Users.getCurrentUserOrThrow(ctx);
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

    const user = await Users.getUserByExternalId(ctx, data.id);
    if (user === null) {
      await Users.addUser(ctx, userAttributes);
    } else {
      await Users.updateUser(ctx, user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await Users.getUserByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await Users.deleteUser(ctx, user._id);
    } else {
      console.warn(
        `Cannot delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});
