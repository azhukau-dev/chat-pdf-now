import { openai } from '@ai-sdk/openai';
import { EntryId, RAG } from '@convex-dev/rag';

import { components } from '../_generated/api';
import { ActionCtx } from '../_generated/server';

const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding('text-embedding-3-small'),
  embeddingDimension: 1536,
});

export async function addEmbedding(
  ctx: ActionCtx,
  { namespace, key, text }: { namespace: string; key: string; text: string },
) {
  return await rag.add(ctx, {
    namespace,
    key,
    text,
  });
}

export async function deleteEmbedding(ctx: ActionCtx, entryId: EntryId) {
  return await rag.delete(ctx, {
    entryId,
  });
}
