'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import dynamic from 'next/dynamic';

import { api } from '@/convex/_generated/api';

import DocumentList from './document-list';
import DocumentListEmpty from './document-list-empty';

const DocumentUploadButton = dynamic(() => import('./document-upload-button'), {
  ssr: false,
});

export interface DocumentListViewProps {
  preloadedDocuments: Preloaded<typeof api.documents.getUserDocuments>;
}

export default function DocumentListView(props: DocumentListViewProps) {
  const documents = usePreloadedQuery(props.preloadedDocuments);

  const hasDocuments = documents.length > 0;

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-3xl font-semibold">Chat Documents</h2>
        </div>
        {hasDocuments && (
          <div className="ml-auto">
            <DocumentUploadButton />
          </div>
        )}
      </div>

      {hasDocuments ? (
        <DocumentList documents={documents} />
      ) : (
        <DocumentListEmpty />
      )}
    </div>
  );
}
