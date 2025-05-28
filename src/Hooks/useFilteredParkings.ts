import { useMemo } from "react";
import { Parking } from "../Services/apiFacade";

export function useFilteredParkings(parkings: Parking[], month: number) {
  return useMemo(() => {
    return parkings.filter((parking) => {
      const parkingDate = new Date(parking.startTime);
      return parkingDate.getMonth() + 1 === month;
    });
  }, [parkings, month]);
}