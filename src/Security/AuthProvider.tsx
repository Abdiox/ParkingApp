import { createContext, useState, ReactNode } from "react";
import { authProvider, User } from ".././Services/authFacade";
import { useContext } from "react";
import { LoginRequest } from ".././Services/authFacade";

import React from "react";

interface AuthContextType {
  signIn: (user: LoginRequest) => Promise<User>;
  signOut: () => void;
  isLoggedIn: () => boolean;
  isLoggedInAs: (role: string[]) => boolean;
  isAdmin: () => boolean;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const initialUsername = localStorage.getItem("username") || null;
  const [username, setUsername] = useState<string | null>(initialUsername);

  const signIn = async (user_: LoginRequest) => {
    return authProvider.signIn(user_).then((loginResponse) => {
      const user: User = {
        email: loginResponse.email,
        password: user_.password, 
        roles: loginResponse.roles,
      };
      setUsername(user.email);
      localStorage.setItem("username", user.email);
      localStorage.setItem("roles", JSON.stringify(user.roles));
      localStorage.setItem("token", loginResponse.token);
      return user;
    });
  };

  const signOut = () => {
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
  };

  const isLoggedIn = () => {
    return username != null;
  };

  const isLoggedInAs = (role: string[]) => {
    const roles: Array<string> = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.some((r) => role.includes(r));
  };

  const isAdmin = () => {
    const roles: Array<string> = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.includes("ADMIN");
  };

  return <AuthContext.Provider value={{ signIn, signOut, isLoggedIn, isLoggedInAs, isAdmin, username }}>{children}</AuthContext.Provider>;
}

