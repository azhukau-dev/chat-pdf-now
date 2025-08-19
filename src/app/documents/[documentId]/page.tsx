import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getAuthToken } from '@/lib/auth';

import DocumentChatPageClient from './page-client';

export default async function DocumentChatPage({
  params,
}: {
  params: Promise<{ documentId: Id<'documents'> }>;
}) {
  const { documentId } = await params;
  const token = await getAuthToken();

  const preloadedFileUrl = await preloadQuery(
    api.documents.getDocumentUrl,
    { documentId },
    { token },
  );

  return <DocumentChatPageClient preloadedFileUrl={preloadedFileUrl} />;
}
