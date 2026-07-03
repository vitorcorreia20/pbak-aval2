import { AppError } from "../../utils/app-error";
import { Holiday } from "./holidays.types";

const cache = new Map<number, Holiday[]>();

async function getHolidaysByYear(year: number): Promise<Holiday[]> {
  if (cache.has(year)) {
    return cache.get(year)!;
  }

  const baseUrl = process.env.HOLIDAYS_API_BASE_URL;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/feriados/v1/${year}`);
  } catch {
    throw new AppError(
      "HOLIDAYS_API_UNAVAILABLE",
      "HOLIDAYS API is unavailable",
      502,
    );
  }

  if (!response.ok) {
    throw new AppError(
      "HOLIDAYS_API_UNAVAILABLE",
      "Holidays API returned an error",
      502,
    );
  }

  const holidays: Holiday[] = await response.json();
  cache.set(year, holidays);
  return holidays;
}

async function isHoliday(date: Date): Promise<boolean> {
  const year = date.getUTCFullYear();
  const dateStr = date.toISOString().slice(0, 10);
  const holidays = await getHolidaysByYear(year);
  return holidays.some((h) => h.date === dateStr);
}

export const holidaysService = { getHolidaysByYear, isHoliday };
