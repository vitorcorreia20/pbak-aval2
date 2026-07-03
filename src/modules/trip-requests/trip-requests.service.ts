import { TripRequest, TripRequestStatus } from "@prisma/client";
import { AppError } from "../../utils/app-error";
import { prisma } from "../../database/prisma-client";
import { holidaysService } from "../holidays/holidays.service";
import {
  CreateTripRequestInput,
  TripRequestResponse,
} from "./trip-requests.types";

function formatTripRequest(tripRequest: TripRequest): TripRequestResponse {
  return {
    id: tripRequest.id,
    requesterName: tripRequest.requesterName,
    origin: tripRequest.origin,
    destination: tripRequest.destination,
    departureAt: tripRequest.departureAt.toISOString(),
    returnAt: tripRequest.returnAt.toISOString(),
    purpose: tripRequest.purpose,
    passengerCount: tripRequest.passengerCount,
    status: tripRequest.status,
    createdAt: tripRequest.createdAt.toISOString(),
  };
}

export async function createTripRequest(
  input: CreateTripRequestInput,
): Promise<TripRequestResponse> {
  const departureAt = new Date(input.departureAt);
  const returnAt = new Date(input.returnAt);

  if (returnAt < departureAt) {
    throw new AppError(
      "VALIDATION_ERROR",
      "returnAt must be greater than or equal to departureAt",
      400,
    );
  }

  const holiday = await holidaysService.isHoliday(departureAt);
  if (holiday) {
    throw new AppError(
      "HOLIDAY_TRIP_NOT_ALLOWED",
      "Trip requests cannot start on a national holiday",
      409,
    );
  }

  const tripRequest = await prisma.tripRequest.create({
    data: {
      requesterName: input.requesterName,
      origin: input.origin,
      destination: input.destination,
      departureAt,
      returnAt,
      purpose: input.purpose,
      passengerCount: input.passengerCount,
    },
  });

  return formatTripRequest(tripRequest);
}

export async function listTripRequests(): Promise<TripRequestResponse[]> {
  const tripRequests = await prisma.tripRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return tripRequests.map(formatTripRequest);
}

export async function getTripRequestById(
  id: string,
): Promise<TripRequestResponse> {
  const tripRequest = await prisma.tripRequest.findUnique({
    where: { id },
  });

  if (!tripRequest) {
    throw new AppError("TRIP_REQUEST_NOT_FOUND", "Trip request not found", 404);
  }

  return formatTripRequest(tripRequest);
}

export async function cancelTripRequest(
  id: string,
): Promise<TripRequestResponse> {
  const tripRequest = await prisma.tripRequest.findUnique({
    where: { id },
  });

  if (!tripRequest) {
    throw new AppError("TRIP_REQUEST_NOT_FOUND", "Trip request not found", 404);
  }

  if (tripRequest.status === TripRequestStatus.canceled) {
    throw new AppError(
      "TRIP_REQUEST_ALREADY_CANCELED",
      "Trip request is already canceled",
      409,
    );
  }

  const updated = await prisma.tripRequest.update({
    where: { id },
    data: { status: TripRequestStatus.canceled },
  });

  return formatTripRequest(updated);
}
