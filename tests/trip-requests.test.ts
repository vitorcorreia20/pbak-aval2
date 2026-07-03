import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { holidaysService } from "../src/modules/holidays/holidays.service";
import { prisma } from "../src/database/prisma-client";

vi.spyOn(holidaysService, "isHoliday").mockResolvedValue(false);

afterEach(async () => {
  await prisma.tripRequest.deleteMany({
    where: { requesterName: "Test User" },
  });
});

const validBody = {
  requesterName: "Test User",
  origin: "Parnaíba",
  destination: "Teresina",
  departureAt: "2026-08-10T10:00:00.000Z",
  returnAt: "2026-08-10T18:00:00.000Z",
  purpose: "Institutional meeting",
  passengerCount: 3,
};

describe("POST /trip-requests", () => {
  it("creates a valid trip request", async () => {
    const res = await request(app).post("/trip-requests").send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("pending");
    expect(res.body.data.requesterName).toBe("Test User");
  });

  it("rejects when returnAt is before departureAt", async () => {
    const res = await request(app)
      .post("/trip-requests")
      .send({
        ...validBody,
        departureAt: "2026-08-10T18:00:00.000Z",
        returnAt: "2026-08-10T10:00:00.000Z",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects when passengerCount is zero", async () => {
    const res = await request(app)
      .post("/trip-requests")
      .send({
        ...validBody,
        passengerCount: 0,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects when passengerCount is negative", async () => {
    const res = await request(app)
      .post("/trip-requests")
      .send({
        ...validBody,
        passengerCount: -1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("blocks trip request when departure date is a national holiday", async () => {
    vi.spyOn(holidaysService, "isHoliday").mockResolvedValueOnce(true);

    const res = await request(app).post("/trip-requests").send(validBody);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("HOLIDAY_TRIP_NOT_ALLOWED");
  });
});

describe("GET /trip-requests/:id", () => {
  it("returns error when trip request does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await request(app).get(`/trip-requests/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("TRIP_REQUEST_NOT_FOUND");
  });
});

describe("PATCH /trip-requests/:id/cancel", () => {
  let createdId: string;

  beforeEach(async () => {
    const res = await request(app).post("/trip-requests").send(validBody);
    createdId = res.body.data.id;
  });

  it("cancels an existing trip request", async () => {
    const res = await request(app).patch(`/trip-requests/${createdId}/cancel`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("canceled");
  });

  it("rejects cancellation of already canceled trip request", async () => {
    await request(app).patch(`/trip-requests/${createdId}/cancel`);
    const res = await request(app).patch(`/trip-requests/${createdId}/cancel`);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("TRIP_REQUEST_ALREADY_CANCELED");
  });
});
