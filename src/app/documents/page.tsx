import { preloadQuery } from 'convex/nextjs';

import DocumentListView from '@/components/documents/document-list-view';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/auth';

export default async function DocumentsPage() {
  const token = await getAuthToken();
  const preloadedDocuments = await preloadQuery(
    api.documents.getDocuments,
    {},
    { token },
  );

  return (
    <div className="mx-auto max-w-5xl p-4">
      <DocumentListView preloadedDocuments={preloadedDocuments} />
    </div>
  );
}
