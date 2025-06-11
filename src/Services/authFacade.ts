import { API_URL } from "../../settings";
import { Roles } from "./apiFacade";
import { makeOptions, handleHttpErrors } from "./fetchUtils";
const LOGIN_URL = API_URL + "/user/login";

interface LoginResponse {
  token: string; 
  user:{
  id: number;
  email: string;
  role: Roles;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: number | null;
  zipCode: number | null;
  city: string;
  };
}

export type LoggedInUser = { 
  token: string;
  id: number, 
  email: string, 
  role: Roles,
  firstName: string,
  lastName: string,
  address: string,
  phoneNumber: number | null,
  zipCode: number | null,
  city: string,
};

interface LoginRequest {
  email: string;
  password: string;
}

const authProvider = {  
  isAuthenticated: false,
  async signIn(user_: LoginRequest): Promise<LoginResponse> {
    const options = await makeOptions("POST", user_, false);

    return await fetch(LOGIN_URL, options).then(handleHttpErrors);
  },
};


export type { LoginResponse, LoginRequest };
export { authProvider };