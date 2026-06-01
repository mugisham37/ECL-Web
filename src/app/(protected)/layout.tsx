export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check temporarily disabled for visual preview
  return <>{children}</>;
}
