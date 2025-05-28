import { useEffect, useState } from "react";
import { getUserCars, Car } from "../Services/apiFacade";

export function useUserCars(userId?: number) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCars() {
      if (userId) {
        setLoading(true);
        setError(null); 
        try {
          const userCars = await getUserCars(userId);
          setCars(userCars);
        } catch (err: any) {
          setError("Kunne ikke hente biler. Prøv igen senere.");
          setCars([]);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchCars();
  }, [userId]);

  return { cars, loading, error };
}