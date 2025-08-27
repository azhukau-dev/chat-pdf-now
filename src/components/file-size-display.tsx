export default function FileSizeDisplay(props: { size: number }) {
  const { size } = props;

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(size) / Math.log(1024));
  const value = (size / Math.pow(1024, index)).toFixed(2);

  return (
    <span>
      {value} {units[index]}
    </span>
  );
}
