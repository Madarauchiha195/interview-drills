// web/src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, googleAuthUrl, updateMeName, updateMeUsername, checkAuthStatus } from "@/services/api";
import type { User } from "@/services/api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session/jwt by calling backend /api/me
  const checkAuth = async () => {
    try {
      // First check auth status
      const authStatus = await checkAuthStatus();
      
      if (authStatus.authenticated && authStatus.user) {
        setUser(authStatus.user);
      } else {
        // Try to get full user data
        const fullUser = await getMe();
        setUser(fullUser);
      }
    } catch (err) {
      console.log("User not authenticated:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    // Redirect browser to backend OAuth start endpoint (this will redirect back after login)
    window.location.href = googleAuthUrl();
  };

  const logout = async () => {
    try {
      await fetch(`${(import.meta.env.VITE_API_BASE_URL || "http://localhost:4000")}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const updateUsername = async (username: string) => {
    try {
      const updated = await updateMeUsername(username);
      setUser(updated);
      console.log("Username updated successfully:", updated.username);
      return updated;
    } catch (error) {
      console.error("Failed to update username:", error);
      throw error;
    }
  };

  const updateName = async (name: string) => {
    try {
      const updated = await updateMeName(name);
      setUser(updated);
      console.log("Name updated successfully:", updated.name);
      return updated;
    } catch (error) {
      console.error("Failed to update name:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const updated = await getMe();
      setUser(updated);
      console.log("User data refreshed successfully");
      return updated;
    } catch (err) {
      console.error("Failed to refresh user:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUsername, 
      updateName, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
