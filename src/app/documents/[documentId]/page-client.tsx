'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import dynamic from 'next/dynamic';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { api } from '@/convex/_generated/api';

const PdfPreview = dynamic(() => import('@/components/chat/pdf-preview'), {
  ssr: false,
});

export interface DocumentChatPageClientProps {
  preloadedFileUrl: Preloaded<typeof api.documents.getDocumentUrl>;
}

export default function DocumentChatPageClient(
  props: DocumentChatPageClientProps,
) {
  const fileUrl = usePreloadedQuery(props.preloadedFileUrl);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="min-w-[500px]">
        <PdfPreview fileUrl={fileUrl ?? ''} />
      </ResizablePanel>
      <ResizableHandle withHandle className="w-1" />
      <ResizablePanel className="min-w-[500px]">DOCUMENT CHAT</ResizablePanel>
    </ResizablePanelGroup>
  );
}
