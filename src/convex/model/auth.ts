import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from 'convex-helpers/server/customFunctions';
import { ConvexError } from 'convex/values';

import {
  ActionCtx,
  MutationCtx,
  QueryCtx,
  action,
  mutation,
  query,
} from '../_generated/server';

export async function checkAuth(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new ConvexError('Not authenticated');
  }
  return identity;
}

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const identity = await checkAuth(ctx);
    return { identity };
  }),
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const identity = await checkAuth(ctx);
    return { identity };
  }),
);

export const authAction = customAction(
  action,
  customCtx(async (ctx) => {
    const identity = await checkAuth(ctx);
    return { identity };
  }),
);
