'use client';

import { Loader2, Upload } from 'lucide-react';

import useDocumentUpload from '@/hooks/use-document-upload';

import { Button } from '../ui/button';

export default function DocumentUploadButton() {
  const { upload, isUploading } = useDocumentUpload();

  function handleUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.onchange = async (e) => {
      const selectedDocument = (e.target as HTMLInputElement).files?.[0];
      if (selectedDocument) {
        await upload(selectedDocument);
      }
    };
    fileInput.click();
  }

  return (
    <Button
      className="text-primary-foreground w-40 bg-emerald-600 hover:bg-emerald-700"
      onClick={handleUpload}
      disabled={isUploading}
    >
      {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
      {isUploading ? 'Uploading...' : 'Upload'}
    </Button>
  );
}
