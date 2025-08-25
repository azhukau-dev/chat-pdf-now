import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import * as Agent from './model/agent';
import * as Auth from './model/auth';
import * as Chats from './model/chats';

export const listChatMessages = Auth.authQuery({
  args: {
    chatId: v.id('chats'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { chatId, paginationOpts }) => {
    const chat = await Chats.getChat(ctx, chatId);
    const messages = await Agent.getMessages(
      ctx,
      chat.agentThreadId,
      paginationOpts,
    );
    return messages;
  },
});
