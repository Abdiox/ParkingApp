

// Formaterer ISO-string til pæn tekst
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString();
};

// Udregner seneste tilladte slutdato
export const calculateMaxEndDate = (startDate: Date, daysAllowed: number): Date => {
  const maxDate = new Date(startDate);
  maxDate.setDate(startDate.getDate() + daysAllowed);
  return maxDate;
};