import { useEffect, useState, useCallback } from "react";
import { getUserCars, Car } from "../Services/apiFacade";

export function useUserCars(userId?: number) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = useCallback(() => {
    console.log("refetch called");
    setReloadFlag(flag => {
      const next = flag + 1;
      return next;
    });
  }, []);

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
  }, [userId, reloadFlag]);

  return { cars, loading, error, refetch };
}