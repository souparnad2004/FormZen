import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";

export function ProtectedRoute() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isSessionLoading = useAuthStore((s) => s.isSessionLoading);
  const hasCheckedSession = useAuthStore((s) => s.hasCheckedSession);

  if (isSessionLoading || !hasCheckedSession) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
}
