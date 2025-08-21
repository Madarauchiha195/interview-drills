// web/src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, googleAuthUrl, updateMeName } from "@/services/api";
import type { User } from "@/services/api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session/jwt by calling backend /api/me
  useEffect(() => {
    (async () => {
      try {
        const u = await getMe();
        setUser(u);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
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
    const updated = await updateMeName(username);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
