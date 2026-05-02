import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ParseUser, loginUser, registerUser, logoutUser } from "@/lib/auth-api";

interface AuthContextType {
  user: ParseUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "nabegu_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ParseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (u: ParseUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (username: string, password: string) => {
    const u = await loginUser(username, password);
    persist(u);
  };

  const register = async (username: string, password: string, email: string, phone?: string) => {
    const u = await registerUser(username, password, email, phone);
    persist({ ...u, username, email, phone });
  };

  const logout = async () => {
    if (user?.sessionToken) await logoutUser(user.sessionToken);
    persist(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
