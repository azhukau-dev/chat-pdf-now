export default function MagicTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-5xl leading-tight font-extrabold text-transparent">
      {children}
    </h1>
  );
}
