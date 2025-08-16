import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from 'convex-helpers/server/customFunctions';
import { ConvexError } from 'convex/values';

import { internal } from './_generated/api';
import {
  MutationCtx,
  QueryCtx,
  action,
  mutation,
  query,
} from './_generated/server';

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return { user };
  }),
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return { user };
  }),
);

export const authAction = customAction(
  action,
  customCtx(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError('Not authenticated');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await ctx.runQuery(internal.users.getByExternalId, {
      externalId: identity.subject,
    });

    return { user };
  }),
);

export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) {
    throw new ConvexError('Not authenticated');
  }
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string,
) {
  return await ctx.db
    .query('users')
    .withIndex('by_external_id', (q) => q.eq('externalId', externalId))
    .unique();
}
