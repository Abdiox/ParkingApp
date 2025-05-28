import { useEffect, useState } from "react";
import { Parking, getUserParkingsByYear } from "../Services/apiFacade";

export function useUserParkingsByYear(userId: number, year: number) {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParkings() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserParkingsByYear(userId, year);
        setParkings(data);
      } catch (err) {
        setError("Kunne ikke hente historik.");
        setParkings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchParkings();
  }, [userId, year]);

  return { parkings, loading, error };
}