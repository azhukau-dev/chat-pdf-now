import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    externalId: v.string(),
  }).index('by_external_id', ['externalId']),
  documents: defineTable({
    name: v.string(),
    user: v.id('users'),
  }),
});
