import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getAuthToken } from '@/lib/auth';

import DocumentChatPageClient from './page-client';

export default async function DocumentChatPage(
  props: PageProps<'/documents/[documentId]'>,
) {
  const { documentId } = await props.params;
  const token = await getAuthToken();

  const preloadedFileUrl = await preloadQuery(
    api.documents.getDocumentDownloadUrl,
    { documentId: documentId as Id<'documents'> },
    { token },
  );

  const preloadedDocument = await preloadQuery(
    api.documents.getDocumentById,
    { documentId: documentId as Id<'documents'> },
    { token },
  );

  return (
    <DocumentChatPageClient
      preloadedFileUrl={preloadedFileUrl}
      preloadedDocument={preloadedDocument}
    />
  );
}
