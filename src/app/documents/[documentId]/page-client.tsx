'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import dynamic from 'next/dynamic';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { api } from '@/convex/_generated/api';
import DocumentChat from '@/features/chat/document-chat';

const DocumentPreview = dynamic(
  () => import('@/features/chat/document-preview'),
  {
    ssr: false,
  },
);

export interface DocumentChatPageClientProps {
  preloadedFileUrl: Preloaded<typeof api.documents.getDocumentDownloadUrl>;
  preloadedDocument: Preloaded<typeof api.documents.getDocumentById>;
}

export default function DocumentChatPageClient(
  props: DocumentChatPageClientProps,
) {
  const fileUrl = usePreloadedQuery(props.preloadedFileUrl);
  const document = usePreloadedQuery(props.preloadedDocument);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="min-w-[500px]">
        <DocumentPreview fileUrl={fileUrl!} />
      </ResizablePanel>
      <ResizableHandle withHandle className="w-1" />
      <ResizablePanel className="min-w-[500px]">
        <DocumentChat document={document} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
