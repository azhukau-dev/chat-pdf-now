'use client';

import { usePaginatedQuery } from 'convex/react';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '../ai-elements/conversation';
import { Message, MessageContent } from '../ai-elements/message';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '../ai-elements/prompt-input';

export interface DocumentChatProps {
  document: Doc<'documents'>;
}

export default function DocumentChat(props: DocumentChatProps) {
  const [text, setText] = useState('');
  const { results: messages } = usePaginatedQuery(
    api.chats.listChatMessages,
    {
      chatId: props.document.chatId!,
    },
    { initialNumItems: 100 },
  );

  console.log(messages);

  function handleSubmitMessage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    console.log(text);
  }

  return (
    <div className="flex h-full flex-col divide-y bg-white">
      <Conversation>
        <ConversationContent>
          <Message from={'user'}>
            <MessageContent>
              Hi, I just uploaded my document. Can you summarize it for me?
            </MessageContent>
          </Message>
          <Message from={'assistant'}>
            <MessageContent>
              Of course! Here’s a brief summary of your document: It discusses
              the impact of renewable energy adoption in urban areas,
              highlighting key benefits and challenges.
            </MessageContent>
          </Message>
          <Message from={'user'}>
            <MessageContent>
              Thanks! Can you point out any statistics mentioned about solar
              energy?
            </MessageContent>
          </Message>
          <Message from={'assistant'}>
            <MessageContent>
              Yes, the document states that solar energy adoption increased by
              35% in cities over the past five years.
            </MessageContent>
          </Message>
          <Message from={'user'}>
            <MessageContent>
              Are there any recommendations for city planners?
            </MessageContent>
          </Message>
          <Message from={'assistant'}>
            <MessageContent>
              The document recommends that city planners invest in rooftop solar
              programs and streamline permitting processes to encourage further
              adoption.
            </MessageContent>
          </Message>
          <Message from={'user'}>
            <MessageContent>
              Great, that’s very helpful. Thank you!
            </MessageContent>
          </Message>
          <Message from={'assistant'}>
            <MessageContent>
              You’re welcome! Let me know if you have any more questions about
              your document.
            </MessageContent>
          </Message>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4">
        <PromptInput className="relative">
          <PromptInputTextarea
            placeholder="Enter your question (max 1,000 characters)"
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <PromptInputToolbar>
            <PromptInputSubmit
              className="absolute right-2 bottom-2"
              disabled={!text}
              status={'ready'}
              onClick={handleSubmitMessage}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
