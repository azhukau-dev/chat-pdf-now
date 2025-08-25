import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { extractTextFromPdf } from '@/lib/pdf';

export default function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFileUploadUrl = useMutation(
    api.documents.generateFileUploadUrl,
  );
  const processUploadedDocument = useMutation(
    api.documents.processUploadedDocument,
  );

  async function upload(file: File) {
    setIsUploading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      const postUrl = await generateFileUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
      });
      const { storageId } = await result.json();
      await processUploadedDocument({
        name: file.name,
        storageId,
        size: file.size,
        text,
      });
      toast.success('Document uploaded successfully');
    } catch (error) {
      setError('Failed to upload document');
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  }

  return { isUploading, error, upload };
}
