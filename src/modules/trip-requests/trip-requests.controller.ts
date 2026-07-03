import { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { sendSuccess } from "../../utils/success-response";
import { createTripRequestSchema } from "./trip-requests.schemas";
import {
  cancelTripRequest,
  createTripRequest,
  getTripRequestById,
  listTripRequests,
} from "./trip-requests.service";

export async function handleCreateTripRequest(req: Request, res: Response) {
  const parsed = createTripRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  const tripRequest = await createTripRequest(parsed.data);
  sendSuccess(res, 201, tripRequest);
}

export async function handleListTripRequests(_req: Request, res: Response) {
  const tripRequests = await listTripRequests();
  sendSuccess(res, 200, tripRequests);
}

export async function handleGetTripRequestById(req: Request, res: Response) {
  const { id } = req.params;
  const tripRequest = await getTripRequestById(id);
  sendSuccess(res, 200, tripRequest);
}

export async function handleCancelTripRequest(req: Request, res: Response) {
  const { id } = req.params;
  const tripRequest = await cancelTripRequest(id);
  sendSuccess(res, 200, tripRequest);
}
