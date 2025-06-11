import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { authProvider, LoggedInUser, LoginRequest } from "../Services/authFacade";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    console.log("Login response:", loginResponse);
    
    const user: LoggedInUser = {
      token: loginResponse.token,
      id: loginResponse.user.id,
      email: loginResponse.user.email,
      role: loginResponse.user.role,
      firstName: loginResponse.user.firstName,
      lastName: loginResponse.user.lastName,
      address: loginResponse.user.address,
      phoneNumber: loginResponse.user.phoneNumber,
      zipCode: loginResponse.user.zipCode,
      city: loginResponse.user.city,
    };
    
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("token", user.token); // Save token separately if needed
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
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        updateUserInContext,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
