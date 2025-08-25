import { WithoutSystemFields } from 'convex/server';
import { ConvexError } from 'convex/values';

import { Doc, Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';

export async function addChat(
  ctx: MutationCtx,
  newChat: WithoutSystemFields<Doc<'chats'>>,
) {
  return await ctx.db.insert('chats', newChat);
}

export async function getChat(ctx: QueryCtx, chatId: Id<'chats'>) {
  const chat = await ctx.db.get(chatId);
  if (!chat) {
    throw new ConvexError('Chat not found');
  }
  return chat;
}

export async function deleteChat(ctx: MutationCtx, chatId: Id<'chats'>) {
  return await ctx.db.delete(chatId);
}
