import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';

export default function useUploadDocument() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const sendDocument = useMutation(api.documents.sendDocument);

  async function upload(file: File) {
    setIsUploading(true);
    setError(null);

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
      });
      const { storageId } = await result.json();
      await sendDocument({ name: file.name, storageId });
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
