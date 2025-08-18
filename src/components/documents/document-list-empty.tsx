import { FileText } from 'lucide-react';

import DocumentUploadButton from './document-upload-button';

export default function DocumentListEmpty() {
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
        <DocumentUploadButton />
      </div>
    </div>
  );
}
