import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';

import { components } from './_generated/api';

export const agent = new Agent(components.agent, {
  name: 'Document Agent',
  languageModel: openai.chat('gpt-4o-mini'),
  instructions: `You are a helpful assistant that can answer questions about the documents.`,
});
