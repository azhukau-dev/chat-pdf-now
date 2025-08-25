import { WithoutSystemFields } from 'convex/server';
import { ConvexError } from 'convex/values';

import { Doc, Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';

export async function getDocuments(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
) {
  return await ctx.db
    .query('documents')
    .withIndex('by_user_id', (q) => q.eq('userId', userId))
    .order('desc')
    .collect();
}

export async function getDocument(
  ctx: QueryCtx | MutationCtx,
  documentId: Id<'documents'>,
) {
  const document = await ctx.db.get(documentId);
  if (!document) {
    throw new ConvexError('Document not found');
  }
  return document;
}

export async function addDocument(
  ctx: MutationCtx,
  newDocument: WithoutSystemFields<Doc<'documents'>>,
) {
  return await ctx.db.insert('documents', newDocument);
}

export async function deleteDocument(
  ctx: MutationCtx,
  documentId: Id<'documents'>,
  storageId: Id<'_storage'>,
) {
  await ctx.storage.delete(storageId);
  await ctx.db.delete(documentId);
}

export async function updateDocument(
  ctx: MutationCtx,
  documentId: Id<'documents'>,
  update: Partial<WithoutSystemFields<Doc<'documents'>>>,
) {
  return await ctx.db.patch(documentId, update);
}
