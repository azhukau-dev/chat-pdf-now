import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default async function DocumentChatPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>DOCUMENT PREVIEW</ResizablePanel>
      <ResizableHandle className="w-1" />
      <ResizablePanel>DOCUMENT CHAT</ResizablePanel>
    </ResizablePanelGroup>
  );
}
