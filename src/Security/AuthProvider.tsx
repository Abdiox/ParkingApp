import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { authProvider, LoggedInUser, LoginRequest } from "../Services/authFacade";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  signIn: (user: LoginRequest) => Promise<LoggedInUser>;
  signOut: () => void;
  isLoggedIn: () => boolean;
  isLoggedInAs: (role: string[]) => boolean;
  isAdmin: () => boolean;
  email: string | null;
  userId: number | null;
} 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
  };

  export default function AuthProvider({ children }: { children: ReactNode }) {
    const [email, setEmail] = useState<string | null>(null);
    const [userId, setuserId] = useState<number | null>(null);
  
    // Kør ved app-start for at tjekke login-status
    useEffect(() => {
      const loadStoredUser = async () => {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedId = await AsyncStorage.getItem("userId"); // Hent id fra AsyncStorage
        const storedToken = await SecureStore.getItemAsync("token");
        if (storedEmail && storedId && storedToken) {
          setEmail(storedEmail);
          setuserId(Number(storedId)); // Sæt id i state
        }
      };
      loadStoredUser();
    }, []);
  
    const signIn = async (user_: LoginRequest): Promise<LoggedInUser> => {
      console.log("(Authprovider) Attempting to sign in with user:", user_);
      
      const loginResponse = await authProvider.signIn(user_);
      console.log("Login response:", loginResponse);
      const user: LoggedInUser = {
        id: loginResponse.id,
        email: loginResponse.email,
        password: user_.password,
        role: loginResponse.role,
      };
  
      // Gem følsomt sikkert
      await SecureStore.setItemAsync("token", String(loginResponse.token));
      await SecureStore.setItemAsync("password", String(user_.password)); // valgfrit
  
      // Gem ikke-følsomt i AsyncStorage
      await AsyncStorage.setItem("email", user.email);
      await AsyncStorage.setItem("userId", user.id.toString()); // Gem id
      setEmail(user.email);
      setuserId(user.id); // Sæt id i state
      return user;
    };
  
    const signOut = async () => {
      setEmail(null);
      setuserId(null); // Nulstil id
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("password");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("userId"); // Fjern id fra AsyncStorage
      await AsyncStorage.removeItem("roles");
    };
  
    const isLoggedIn = () => email != null;
  
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
      <AuthContext.Provider value={{ signIn, signOut, isLoggedIn, isLoggedInAs, isAdmin, email, userId }}>
        {children}
      </AuthContext.Provider>
    );
  }