import { formatDistanceToNow } from 'date-fns';

export default function CreationDateDisplay({
  creationDate,
}: {
  creationDate: number;
}) {
  const daysAgo = formatDistanceToNow(new Date(creationDate), {
    addSuffix: true,
  });
  return <span>{daysAgo}</span>;
}
