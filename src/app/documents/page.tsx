import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import DocumentListView from '@/features/documents/document-list-view';
import { getAuthToken } from '@/lib/auth';

export default async function DocumentsPage() {
  const token = await getAuthToken();
  const preloadedDocuments = await preloadQuery(
    api.documents.getUserDocuments,
    {},
    { token },
  );

  return (
    <div className="mx-auto w-full max-w-5xl p-4">
      <DocumentListView preloadedDocuments={preloadedDocuments} />
    </div>
  );
}
