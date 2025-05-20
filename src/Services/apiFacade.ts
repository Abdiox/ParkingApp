import { API_URL } from "../../settings"
import { makeOptions, handleHttpErrors } from "./fetchUtils";


const USER_URL = API_URL + "/user"
const PARKING_URL = API_URL + "/parking"
const PARKING_AREA_URL = API_URL + "/pArea"
const CAR_URL = API_URL + "/cars"

interface UserCreate {
    firstName: String | null;
    lastName: String | null;
    email: String | null;
    password: String | null; 
    phoneNumber: number | null;
    rentalUnit: number | null;
    address: String | null;
    zipCode: number | null;
    city: String | null;
    role: Roles | null;
}

interface User {
    id: number | null;
    firstName: String | null;
    lastName: String | null;
    email: String | null;
    password: String | null; 
    phoneNumber: number | null;
    rentalUnit: number | null;
    address: String | null;
    zipCode: number | null;
    city: String | null;
    role: Roles | null;
}

enum Roles {
    PVAGT = "PVAGT",
    ADMIN = "ADMIN",
    USER = "USER",
}

interface Parking {
 id: number | null;
 parea: pArea | null;  
 plateNumber: String | null;
 carColor: String | null;
 carBrand: String | null;
 carModel: String | null; 
 startTime: String | null; // skal være LocalDateTime
 endTime: String | null; // skal være LocalDateTime
 userId: number | null; 
}

interface pArea {
    id: number | null;
    daysAllowedParking: number | null;
    areaName: String | null;
    city: String | null;
    postalCode: number | null;
}

interface Car {
    id: number | null;
    numberPlate: String | null;
    brand: String | null;
    model: String | null;
    year: number | null;
    color: String | null;
    type: String | null;
    description: String | null;  
    userId: number | null;
}

let users: Array<User> = [];


 //--------------- Alt med users -------------------\\
 export async function getAllUsers(): Promise<Array<User>> {
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

export async function getUser(id:number): Promise<User> {
    return fetch(USER_URL + "/" + id).then(handleHttpErrors);
}

export async function addUser(user: UserCreate): Promise<User> {
    const options = makeOptions("POST", user);
    return fetch(USER_URL + "/add", options).then(handleHttpErrors);
}

export async function updateUser(user: User): Promise<User> {
    const options = makeOptions("PUT", user);
    return fetch(USER_URL + "/" + user.id, options).then(handleHttpErrors);
}


export async function deleteUser(id: number): Promise<void> {
    const options = makeOptions("DELETE", null);
    return fetch(USER_URL + "/" + id, options).then(handleHttpErrors);
}

 //--------------- Alt med Parkering -------------------\\

 export async function registerParking(parking: Parking): Promise<Parking> {
    const options = makeOptions("POST", parking);
    return fetch(PARKING_URL + "/add", options).then(handleHttpErrors);
}

export async function getUserParkings(userId: number): Promise<Array<Parking>> {
    return fetch(PARKING_URL + "/user/" + userId).then(handleHttpErrors);
}

export async function getUserParkingsByYear(userId: number, year: number): Promise<Array<Parking>> {
    return fetch(PARKING_URL + "/user/" + userId + "/year/" + year).then(handleHttpErrors);
}

export async function getActiveParkings(userId: number): Promise<Array<Parking>> {
    return fetch(PARKING_URL + "/active/user/" + userId).then(handleHttpErrors);
}

export async function deleteParking(id: number): Promise<void> {
    console.log("Deleting parking with ID:", id);
    const options = makeOptions("DELETE", null);
    
    const response = await fetch(PARKING_URL + "/" + id, options);
     console.log("Response from deleteParking:", response);
     
    // Tjek kun for status, da der ikke er noget JSON-svar
    if (!response.ok) {
      throw new Error(`Failed to delete parking with status: ${response.status}`);
    }
  }


//---------------- P-Area -------------------\\

export async function getAllParkingAreas(): Promise<Array<pArea>> {
    return fetch(PARKING_AREA_URL).then(handleHttpErrors);
}


//---------------- Cars -------------------\\

export async function getUserCars(userId: number): Promise<Array<Car>> {
    return fetch(CAR_URL + "/user/" + userId).then(handleHttpErrors);
}

export async function addCar(car: Car): Promise<Car> {
    const options = makeOptions("POST", car);
    return fetch(CAR_URL, options).then(handleHttpErrors);
}
export async function updateCar(car: Car): Promise<Car> {
    const options = makeOptions("PUT", car);
    return fetch(CAR_URL + "/" + car.id, options).then(handleHttpErrors);
}

export async function deleteCar(id: number): Promise<void> {
    const options = makeOptions("DELETE", null);
    return fetch(CAR_URL + "/" + id, options).then(handleHttpErrors);
}

export async function getCarFromNumberplate(plateNumber: String): Promise<any> {
    const options = {
        method: "GET",
        headers: {
            "X-AUTH-TOKEN": "yrmcj2i0msgeny6ukaxh34gvgv6ihgl0",
            "Content-Type": "application/json",
        },
    };
    return fetch('https://v1.motorapi.dk/vehicles/' + plateNumber, options).then(handleHttpErrors);
}




export type { User, UserCreate, Parking , Roles, pArea, Car};


