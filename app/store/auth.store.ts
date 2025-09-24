import { getCurrentUser, signOut, updateUserProfile } from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phoneNumber?: string;
    address?: string;
  }) => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();

      if (user) set({ isAuthenticated: true, user: user as unknown as User });
      else set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut();
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const { isLoading, user } = useAuthStore.getState();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      if (!user?.$id) throw new Error("No user found");

      const updatedUser = await updateUserProfile(user.$id, data);

      set({
        user: updatedUser as unknown as User,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
