import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { authProvider, User, LoginRequest } from "../services/authFacade";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const context = useContext(AuthContext);
  console.log("AuthContext value:", context);
  return context;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);

  // Kør ved app-start for at tjekke login-status
  // useEffect(() => {
  //   const loadStoredUser = async () => {
  //     const storedUsername = await AsyncStorage.getItem("username");
  //     const storedToken = await SecureStore.getItemAsync("token");
  //     if (storedUsername && storedToken) {
  //       setUsername(storedUsername);
  //     }
  //   };
  //   loadStoredUser();
  // }, []);

  const signIn = async (user_: LoginRequest): Promise<User> => {
    console.log("(Authprovider) Attempting to sign in with user:", user_);
    
    const loginResponse = await authProvider.signIn(user_);
    console.log("Login response:", loginResponse);
    const user: User = {
      email: loginResponse.email,
      password: user_.password,
      roles: loginResponse.roles,
    };

    // Gem følsomt sikkert
    await SecureStore.setItemAsync("token", String(loginResponse.token));
    await SecureStore.setItemAsync("password", String(user_.password)); // valgfrit
    

    // Gem ikke-følsomt i AsyncStorage
    await AsyncStorage.setItem("username", user.email);
    // await AsyncStorage.setItem("roles", JSON.stringify(user.roles ?? []));
    setUsername(user.email);
    return user;
  };

  const signOut = async () => {
    setUsername(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("password");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("roles");
  };

  const isLoggedIn = () => username != null;

  const isLoggedInAs = (rolesToCheck: string[]) => {
    return AsyncStorage.getItem("roles").then((rolesString) => {
      const roles: string[] = JSON.parse(rolesString || "[]");
      return roles.some((r) => rolesToCheck.includes(r));
    });
  };

  const isAdmin = () => {
    return AsyncStorage.getItem("roles").then((rolesString) => {
      const roles: string[] = JSON.parse(rolesString || "[]");
      return roles.includes("ADMIN");
    });
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isLoggedIn, isLoggedInAs, isAdmin, username }}>
      {children}
    </AuthContext.Provider>
  );
}
