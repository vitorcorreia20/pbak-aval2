import { Router } from "express";
import {
  handleCancelTripRequest,
  handleCreateTripRequest,
  handleGetTripRequestById,
  handleListTripRequests,
} from "./trip-requests.controller";

export const tripRequestRoutes = Router();

tripRequestRoutes.post("/", handleCreateTripRequest);
tripRequestRoutes.get("/", handleListTripRequests);
tripRequestRoutes.get("/:id", handleGetTripRequestById);
tripRequestRoutes.patch("/:id/cancel", handleCancelTripRequest);
