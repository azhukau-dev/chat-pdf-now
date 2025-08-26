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
    agentThreadId: v.union(v.string(), v.null()),
    ragEntryId: v.union(vEntryId, v.null()),
  }).index('by_user_id', ['userId']),
});
