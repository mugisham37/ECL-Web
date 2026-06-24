import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { BackendStatusBanner } from "@/components/shared/BackendStatusBanner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <QueryProvider>
        {children}
        <BackendStatusBanner />
      </QueryProvider>
    </AuthProvider>
  );
}
