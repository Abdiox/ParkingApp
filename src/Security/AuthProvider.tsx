import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { authProvider, LoggedInUser, LoginRequest } from "../Services/authFacade";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  signIn: (user: LoginRequest) => Promise<LoggedInUser>;
  signOut: () => void;
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

  };


  const updateUserInContext = async (updatedUser: LoggedInUser) => {
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      updateUserInContext,
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
}
