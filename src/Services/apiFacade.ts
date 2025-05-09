import { API_URL } from "../../settings"
import { makeOptions, handleHttpErrors } from "./fetchUtils";


const USER_URL = API_URL + "/user"

interface UserCreate {
    name: String | null;
    email: String | null;
    password: String | null; 
    phoneNumber: number | null;
    rentalUnit: number | null;
    address: String | null;
    zipCode: number | null;
    city: String | null;
}

interface User {
    id: number | null;
    name: String | null;
    email: String | null;
    password: String | null; 
    phoneNumber: number | null;
    rentalUnit: number | null;
    address: String | null;
    zipCode: number | null;
    city: String | null;
}


let users: Array<User> = [];

async function getAllUsers(): Promise<Array<User>> {
    if (users.length === 0) return [...users];
    try {
        const res = await fetch(USER_URL);
        if (!res.ok) {
            throw new Error("Failed to fetch users");
        }
        const data: Array<User> = await res.json();
        users = data;
        return [...users];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

async function getUser(id:number): Promise<User> {
    return fetch(USER_URL + "/" + id).then(handleHttpErrors);
}

async function addUser(user: UserCreate): Promise<User> {
    const options = makeOptions("POST", user);
    return fetch(USER_URL + "/add", options).then(handleHttpErrors);
}

async function updateUser(user: User): Promise<User> {
    const options = makeOptions("PUT", user, true);
    return fetch(USER_URL + "/" + user.id, options).then(handleHttpErrors);
}


async function deleteUser(id: number): Promise<void> {
    const options = makeOptions("DELETE", null, true);
    return fetch(USER_URL + "/" + id, options).then(handleHttpErrors);
}


export type { User, UserCreate };

export { getAllUsers, getUser, addUser, updateUser, deleteUser
}
