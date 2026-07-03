import { z } from "zod";

export const createTripRequestSchema = z.object({
  requesterName: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  departureAt: z.iso.datetime(),
  returnAt: z.iso.datetime(),
  purpose: z.string().min(1),
  passengerCount: z.number().int().positive(),
});

export type CreateTripRequestSchema = z.infer<typeof createTripRequestSchema>;
