import { Router, Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { sendSuccess } from "../../utils/success-response";
import { holidaysService } from "./holidays.service";

export const holidayRoutes = Router();

holidayRoutes.get("/:year", async (req: Request, res: Response) => {
  const year = parseInt(req.params.year, 10);

  if (isNaN(year)) {
    throw new AppError("VALIDATION_ERROR", "Year must be a valid number", 400);
  }

  const holidays = await holidaysService.getHolidaysByYear(year);
  sendSuccess(res, 200, holidays);
});
