'use client';

import { useMutation } from 'convex/react';
import { Trash } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';

import CreationDateDisplay from '../common/creation-date-display';
import FileSizeDisplay from '../common/file-size-display';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { TableCell, TableRow } from '../ui/table';

export interface DocumentListItemProps {
  document: Doc<'documents'>;
}

export default function DocumentListItem(props: DocumentListItemProps) {
  const { document } = props;

  const deleteDocument = useMutation(api.documents.deleteDocument);

  async function handleDelete(documentId: Id<'documents'>) {
    try {
      await deleteDocument({ documentId });
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Button variant="link" asChild>
          <Link href={`/documents/${document._id}`}>{document.name}</Link>
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <FileSizeDisplay size={document.size} />
      </TableCell>
      <TableCell className="text-right">
        <CreationDateDisplay creationDate={document._creationTime} />
      </TableCell>
      <TableCell className="text-right">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete document</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the following document?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => handleDelete(document._id)}
              >
                Delete
              </AlertDialogAction>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
