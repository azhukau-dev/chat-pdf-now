'use client';

import { FileText } from 'lucide-react';
import dynamic from 'next/dynamic';

const DocumentUploadButton = dynamic(() => import('./document-upload-button'), {
  ssr: false,
});

export interface DocumentListEmptyProps {
  onUploadSuccess?: () => void;
  onUploadError?: (error: unknown) => void;
}

export default function DocumentListEmpty(props: DocumentListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-16">
      <div className="flex flex-col items-center justify-center space-y-2">
        <FileText className="size-10" />
        <h3 className="font-semibold text-gray-900">No documents</h3>
        <p className="text-sm text-gray-600">
          Get started by uploading a new document.
        </p>
      </div>
      <div className="mx-auto">
        <DocumentUploadButton
          showToast={false}
          onUploadSuccess={props.onUploadSuccess}
          onUploadError={props.onUploadError}
        />
      </div>
    </div>
  );
}
