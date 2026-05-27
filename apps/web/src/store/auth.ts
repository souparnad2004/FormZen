import { create } from "zustand";
import type { UserSchemaType } from "@repo/types";


type AuthState = {
  isLoggedIn: boolean;
  isSessionLoading: boolean;
  hasCheckedSession: boolean;
  user: null | UserSchemaType;
  setUser: (user: UserSchemaType | null) => void;
  setSessionLoading: (isSessionLoading: boolean) => void;
  setHasCheckedSession: (hasCheckedSession: boolean) => void;

  clear: () => void
  login: (user: UserSchemaType) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isSessionLoading: true,
  hasCheckedSession: false,
  user: null,

  setUser: (user: UserSchemaType | null) =>
    set({
      user,
      isLoggedIn: Boolean(user),
      hasCheckedSession: true,
      isSessionLoading: false,
    }),

  setSessionLoading: (isSessionLoading: boolean) => set({ isSessionLoading }),

  setHasCheckedSession: (hasCheckedSession: boolean) => set({ hasCheckedSession }),

  clear: () =>
    set({
      user: null,
      isLoggedIn: false,
      hasCheckedSession: true,
      isSessionLoading: false,
    }),

  login: (user) =>
    set({
      isLoggedIn: true,
      user,
      hasCheckedSession: true,
      isSessionLoading: false,
    }),

  logout: () =>
    set({   
      isLoggedIn: false,
      user: null,
      hasCheckedSession: true,
      isSessionLoading: false,
    }),
}));
