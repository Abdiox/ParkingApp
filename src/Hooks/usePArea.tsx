import { useEffect, useState } from "react";
import { getAllParkingAreas, pArea } from "../Services/apiFacade";

export function usePArea() {
  const [pAreas, setPAreas] = useState<pArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParkingAreas() {
      setLoading(true);
      setError(null);
      try {
        const areas = await getAllParkingAreas();
        setPAreas(areas);
      } catch (error) {
        setError("Kunne ikke hente parkeringsområder.");
        setPAreas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchParkingAreas();
  }, []);

  return { pAreas, loading, error };
}