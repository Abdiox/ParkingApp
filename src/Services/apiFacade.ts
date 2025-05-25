import { API_URL } from "../../settings"
import { makeOptions, handleHttpErrors } from "./fetchUtils";


const USER_URL = API_URL + "/user"
const PARKING_URL = API_URL + "/parking"
const PARKING_AREA_URL = API_URL + "/pArea"
const CAR_URL = API_URL + "/cars"
const RentalUnit_URL = API_URL + "/rentalUnit"
const CASE_URL = API_URL + "/case"

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
    registrationNumber: String | null;
    make: String | null;
    model: String | null;
    modelYear: number | null;
    color: String | null;
    type: String | null;
    totalWeight: number | null;
    description: String | null;  
    userId: number | null;
}

interface Case {
    id: number | null;
    plateNumber: String | null;
    time: String | null;
    description: String | null;
    done: boolean | null;
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
    return fetch(USER_URL + "/update/" + user.id, options).then(handleHttpErrors);
}


export async function deleteUser(id: number): Promise<void> {
    const options = makeOptions("DELETE", null);
    return fetch(USER_URL + "/" + id, options).then(handleHttpErrors);
}

//---------------- RentalUnit -------------------\\
export async function checkRentalUnit(rentalUnit: number): Promise<Boolean> {
    return fetch(RentalUnit_URL + "/check/" + rentalUnit).then(handleHttpErrors);
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
     
    if (!response.ok) {
      throw new Error(`Failed to delete parking with status: ${response.status}`);
    }
  }

export async function hasActiveParkingByPlateNumber(plateNumber: String): Promise<Boolean> {
    return fetch(PARKING_URL + "/active/plateNumber/" + plateNumber).then(handleHttpErrors);
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


//---------------- Cases -------------------\\
export async function getCasesByUserId(userId: number): Promise<Case[]> {
    return fetch(CASE_URL + "/user/" + userId).then(handleHttpErrors);
}

export async function addCase(newCase: Case): Promise<Case> {
    const options = makeOptions("POST", newCase);
    return fetch(CASE_URL + "/add", options).then(handleHttpErrors);
}


//---------------- Foreign api calls -------------------\\

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

// OCR.space API-kald
export async function scanWithOCRSpace(base64Image: string): Promise<string | null> {
  const apiKey = "K89400181888957"; // Gratis testnøgle, lav evt. din egen på ocr.space
  const formData = new FormData();
  formData.append("base64Image", "data:image/jpg;base64," + base64Image);
  formData.append("language", "dan");
  formData.append("isOverlayRequired", "false");
  console.log("Base64 length:", base64Image.length);


  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: apiKey,
    },
    body: formData,
  });
  const data = await response.json();

  console.log("OCR Response:", data);

  try {
    const text = data.ParsedResults[0].ParsedText;
    const match = text.match(/[A-ZÆØÅ]{2}[-\s]?\d{2}[-\s]?\d{3}/i);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}




export type { User, UserCreate, Parking , Roles, pArea, Car, Case };


