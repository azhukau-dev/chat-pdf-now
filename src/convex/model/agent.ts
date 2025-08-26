import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';
import { PaginationOptions } from 'convex/server';

import { components } from '../_generated/api';
import { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';

export const documentAgent = new Agent(components.agent, {
  name: 'Document Agent',
  languageModel: openai.chat('gpt-4o-mini'),
  textEmbeddingModel: openai.textEmbedding('text-embedding-3-small'),
  instructions: `
    You are a helpful assistant that can answer questions about the documents.
    You can use the document to answer questions.
    If the user asks a question that is not related to the document, you should say that you are not able to answer that question.
    `,
});

export async function createThread(ctx: MutationCtx) {
  return await documentAgent.createThread(ctx);
}

export async function deleteThread(ctx: ActionCtx, threadId: string) {
  return await documentAgent.deleteThreadSync(ctx, { threadId });
}

export async function getMessages(
  ctx: QueryCtx,
  threadId: string,
  paginationOpts: PaginationOptions,
) {
  return await documentAgent.listMessages(ctx, { threadId, paginationOpts });
}
