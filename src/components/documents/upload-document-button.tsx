'use client';

import { Loader2, Upload } from 'lucide-react';

import useUploadDocument from '@/hooks/use-upload-document';

import { Button } from '../ui/button';

export default function UploadDocumentButton() {
  const { upload, isUploading } = useUploadDocument();

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
      size="lg"
      className="text-primary-foreground w-40 bg-emerald-600 hover:bg-emerald-700"
      onClick={handleUpload}
      disabled={isUploading}
    >
      {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
      {isUploading ? 'Uploading...' : 'Upload'}
    </Button>
  );
}
