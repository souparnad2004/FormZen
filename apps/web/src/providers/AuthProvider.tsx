import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/auth";
import type { UserSchemaType } from "@repo/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setSessionLoading = useAuthStore((s) => s.setSessionLoading);

  const { data, isLoading, isError } = trpc.auth.me.useQuery();

  useEffect(() => {
    setSessionLoading(isLoading);

    if (isLoading) return;

    if (!isError && data?.user) {
      setUser(data.user as UserSchemaType);
    } else {
      setUser(null);
    }
  }, [data, isError, isLoading, setSessionLoading, setUser]);

  return children;
}
