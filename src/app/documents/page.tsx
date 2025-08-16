import NoDocumentsFound from '@/components/documents/no-documents-found';

export default function DocumentsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col space-y-4 p-4">
      <h2 className="text-3xl font-semibold">Chat Documents</h2>
      <div className="flex flex-1 flex-col items-center justify-center">
        <NoDocumentsFound />
      </div>
    </div>
  );
}
