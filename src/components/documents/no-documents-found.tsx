'use client';

import { FileText, Upload } from 'lucide-react';

import { Button } from '../ui/button';

export default function NoDocumentsFound() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col items-center justify-center space-y-2">
        <FileText className="size-10" />
        <h3 className="font-semibold text-gray-900">No documents</h3>
        <p className="text-sm text-gray-600">
          Get started by uploading a new document.
        </p>
      </div>
      <div className="mx-auto">
        <Button
          size="lg"
          className="text-primary-foreground w-40 bg-emerald-600 hover:bg-emerald-700"
        >
          <Upload />
          Upload
        </Button>
      </div>
    </div>
  );
}
