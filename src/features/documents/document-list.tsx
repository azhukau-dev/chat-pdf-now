import { Table, TableBody } from '@/components/ui/table';
import { Doc } from '@/convex/_generated/dataModel';

import DocumentListItem from './document-list-item';

export interface DocumentListProps {
  documents: Doc<'documents'>[];
}

export default function DocumentList(props: DocumentListProps) {
  const { documents } = props;

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableBody>
          {documents.map((document) => (
            <DocumentListItem key={document._id} document={document} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
