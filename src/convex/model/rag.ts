import { openai } from '@ai-sdk/openai';
import { EntryId, RAG } from '@convex-dev/rag';

import { components } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import { ActionCtx } from '../_generated/server';

const documentRag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding('text-embedding-3-small'),
  embeddingDimension: 1536,
  filterNames: ['documentId'],
});

export async function searchDocumentEmbeddings(
  ctx: ActionCtx,
  {
    documentId,
    userId,
    query,
  }: { documentId: Id<'documents'>; userId: Id<'users'>; query: string },
) {
  const result = await documentRag.search(ctx, {
    namespace: userId,
    query,
    limit: 10,
    filters: [
      {
        name: 'documentId',
        value: documentId,
      },
    ],
  });
  return result;
}

export async function addDocumentEmbedding(
  ctx: ActionCtx,
  {
    userId,
    documentId,
    text,
  }: { userId: Id<'users'>; documentId: Id<'documents'>; text: string },
) {
  return await documentRag.add(ctx, {
    namespace: userId,
    text,
    filterValues: [
      {
        name: 'documentId',
        value: documentId,
      },
    ],
  });
}

export async function deleteDocumentEmbedding(
  ctx: ActionCtx,
  entryId: EntryId,
) {
  return await documentRag.delete(ctx, {
    entryId,
  });
}
