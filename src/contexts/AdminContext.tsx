import React, { createContext, useCallback, useContext, useState } from "react";
import { verifyPassword } from "@/lib/eventsApi";

interface AdminContextValue {
  isAdmin: boolean;
  password: string;
  unlock: (password: string) => Promise<{ ok: boolean; error?: string; status?: number }>;
  lock: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

// In-memory only (no localStorage/cookies): unlocking is scoped to the current
// page session and is lost on refresh, by design — this is not a login system.
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  const unlock = useCallback(async (pwd: string) => {
    try {
      const { ok, status, data } = await verifyPassword(pwd);
      if (ok) {
        setIsAdmin(true);
        setPassword(pwd);
        return { ok: true };
      }
      return { ok: false, status, error: (data as { error?: string })?.error };
    } catch {
      return { ok: false, error: "Network error" };
    }
  }, []);

  const lock = useCallback(() => {
    setIsAdmin(false);
    setPassword("");
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, password, unlock, lock }}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
