export interface TripRequestResponse {
  id: string;
  requesterName: string;
  origin: string;
  destination: string;
  departureAt: string;
  returnAt: string;
  purpose: string;
  passengerCount: number;
  status: string;
  createdAt: string;
}
export interface CreateTripRequestInput {
  requesterName: string;
  origin: string;
  destination: string;
  departureAt: string;
  returnAt: string;
  purpose: string;
  passengerCount: number;
}
