import { useEffect, useState, useCallback } from "react";
import { getActiveParkings, Parking } from "../Services/apiFacade";

export function useUserParkings(userId?: number) {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = useCallback(() => {
    setReloadFlag(flag => flag + 1);
  }, []);

  useEffect(() => {
    async function fetchParkings() {
      if (userId) {
        setLoading(true);
        setError(null);
        try {
          const allParkings = await getActiveParkings(userId);
          setParkings(allParkings);
        } catch (err: any) {
          setError("Kunne ikke hente parkeringer. Prøv igen senere.");
          setParkings([]);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchParkings();
  }, [userId, reloadFlag]);

  return { parkings, loading, error, refetch };
}