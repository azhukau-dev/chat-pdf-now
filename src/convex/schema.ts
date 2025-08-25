import { vEntryId } from '@convex-dev/rag';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    externalId: v.string(),
  }).index('by_external_id', ['externalId']),
  documents: defineTable({
    name: v.string(),
    userId: v.id('users'),
    storageId: v.id('_storage'),
    size: v.number(),
    chatId: v.union(v.id('chats'), v.null()),
  }).index('by_user_id', ['userId']),
  chats: defineTable({
    documentId: v.id('documents'),
    agentThreadId: v.string(),
    ragEntryId: vEntryId,
  }),
});
