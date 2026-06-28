import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { TokenSyncProvider } from "@/providers/TokenSyncProvider";
import { BackendStatusBanner } from "@/components/shared/BackendStatusBanner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <TokenSyncProvider>
        <QueryProvider>
          {children}
          <BackendStatusBanner />
        </QueryProvider>
      </TokenSyncProvider>
    </AuthProvider>
  );
}
