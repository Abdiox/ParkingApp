import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { authProvider, LoggedInUser, LoginRequest } from "../Services/authFacade";
import AsyncStorage from '@react-native-async-storage/async-storage';

// AuthContextType med kun brugerinfo
interface AuthContextType {
  signIn: (user: LoginRequest) => Promise<LoggedInUser>;
  signOut: () => void;
  isLoggedIn: () => boolean;
  isLoggedInAs: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  updateUserInContext: (user: LoggedInUser) => Promise<void>;
  user: LoggedInUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  // Tjek login-status ved app-start
  useEffect(() => {
    const loadStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadStoredUser();
  }, []);

  const signIn = async (user_: LoginRequest): Promise<LoggedInUser> => {
    const loginResponse = await authProvider.signIn(user_);
    const user: LoggedInUser = {
      id: loginResponse.id,
      email: loginResponse.email,
      role: loginResponse.role,
      firstName: loginResponse.firstName,
      lastName: loginResponse.lastName,
      address: loginResponse.address,
      phoneNumber: loginResponse.phoneNumber,
      zipCode: loginResponse.zipCode,
      city: loginResponse.city,
    };
    console.log("User logged in:", user);
    

    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("roles");
  };

  const isLoggedIn = () => user !== null;

  const isLoggedInAs = (rolesToCheck: string[]) => {
    if (!user) return false;
    return rolesToCheck.includes(user.role);
  };

  const isAdmin = () => {
    if (!user) return false;
    return user.role === "ADMIN";
  };

  const updateUserInContext = async (updatedUser: LoggedInUser) => {
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      isLoggedIn,
      isLoggedInAs,
      isAdmin,
      updateUserInContext,
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
}
