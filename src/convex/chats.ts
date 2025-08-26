import { vStreamArgs } from '@convex-dev/agent';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import * as Agent from './model/agent';
import * as Auth from './model/auth';
import * as Rag from './model/rag';
import * as Users from './model/users';

export const searchDocumentEmbeddings = internalAction({
  args: {
    userId: v.id('users'),
    documentId: v.id('documents'),
    query: v.string(),
  },
  handler: async (ctx, { userId, documentId, query }) => {
    return await Rag.searchDocumentEmbeddings(ctx, {
      userId,
      documentId,
      query,
    });
  },
});

export const streamMessage = internalAction({
  args: {
    userPrompt: v.string(),
    promptMessageId: v.string(),
    threadId: v.string(),
    userId: v.id('users'),
    documentId: v.id('documents'),
  },
  handler: async (
    ctx,
    { userPrompt, promptMessageId, threadId, userId, documentId },
  ) => {
    const context = await ctx.runAction(
      internal.chats.searchDocumentEmbeddings,
      {
        userId,
        documentId,
        query: userPrompt,
      },
    );
    const result = await Agent.documentAgent.streamText(
      ctx,
      { threadId },
      {
        promptMessageId,
        prompt: `# Context:\n\n${context.text}\n\n---\n\n# Question:\n\n"""${userPrompt}\n"""`,
      },
      {
        saveStreamDeltas: { chunking: 'word', throttleMs: 100 },
      },
    );
    await result.consumeStream();
  },
});

export const listMessages = Auth.authQuery({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, { threadId, paginationOpts, streamArgs }) => {
    const streams = await Agent.documentAgent.syncStreams(ctx, {
      threadId,
      streamArgs,
      includeStatuses: ['aborted', 'streaming'],
    });
    const paginated = await Agent.getMessages(ctx, threadId, paginationOpts);

    return {
      ...paginated,
      streams,
    };
  },
});

export const sendMessage = Auth.authMutation({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    documentId: v.id('documents'),
  },
  handler: async (ctx, { prompt, threadId, documentId }) => {
    const user = await Users.getCurrentUserOrThrow(ctx);
    const { messageId } = await Agent.documentAgent.saveMessage(ctx, {
      threadId,
      prompt,
      // Skip embeddings for now. They'll be generated lazily when streaming the text.
      skipEmbeddings: true,
    });
    await ctx.scheduler.runAfter(0, internal.chats.streamMessage, {
      threadId,
      userPrompt: prompt,
      promptMessageId: messageId,
      userId: user._id,
      documentId,
    });
  },
});
