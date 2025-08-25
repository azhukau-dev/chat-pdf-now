import { ConvexError } from 'convex/values';

import { Doc, Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';

export async function addUser(
  ctx: MutationCtx,
  user: {
    name: string;
    externalId: string;
  },
) {
  return await ctx.db.insert('users', user);
}

export async function updateUser(
  ctx: MutationCtx,
  userId: Id<'users'>,
  user: {
    name: string;
    externalId: string;
  },
) {
  return await ctx.db.patch(userId, user);
}

export async function deleteUser(ctx: MutationCtx, userId: Id<'users'>) {
  return await ctx.db.delete(userId);
}

export async function getUserByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string,
): Promise<Doc<'users'> | null> {
  return await ctx.db
    .query('users')
    .withIndex('by_external_id', (q) => q.eq('externalId', externalId))
    .unique();
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await getUserByExternalId(ctx, identity.subject);
}

export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (userRecord === null) {
    throw new ConvexError('User not found');
  }
  return userRecord;
}
