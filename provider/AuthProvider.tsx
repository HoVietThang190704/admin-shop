"use client";

import { logout as logoutFn } from "@/action/logout/logout";
import React, { createContext, useEffect } from "react";
import { User } from "@/lib/interface/user.interface";

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => Promise.resolve(),
});

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(initialUser);
  const logout = async () => {
    await logoutFn();
    setUser(null);
  };
  useEffect(() => {
    setUser(initialUser);
    
  }, [initialUser]);
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
