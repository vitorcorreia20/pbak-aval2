import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './app';
import { holidaysService } from './modules/holidays/holidays.service';

vi.mock('./modules/holidays/holidays.service', () => ({
  holidaysService: {
    isHoliday: vi.fn(),
    getHolidaysByYear: vi.fn()
  }
}));

describe('Trip Requests API - Integration Tests', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a valid trip request with status pending', async () => {
    vi.mocked(holidaysService.isHoliday).mockResolvedValue(false);

    const validTrip = {
      requesterName: "Maria Silva",
      origin: "Parnaiba",
      destination: "Teresina",
      departureAt: "2026-06-24T10:00:00.000Z",
      returnAt: "2026-06-24T18:00:00.000Z",
      purpose: "Participation in an institutional meeting",
      passengerCount: 3
    };

    const response = await request(app)
      .post('/trip-requests')
      .send(validTrip);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.status).toBe('pending');
  });

  it('should return VALIDATION ERROR when returnAt is before departureAt', async () => {
    const invalidTrip = {
      requesterName: "Maria Silva",
      origin: "Parnaiba",
      destination: "Teresina",
      departureAt: "2026-06-25T10:00:00.000Z",
      returnAt: "2026-06-24T10:00:00.000Z",
      purpose: "Meeting",
      passengerCount: 1
    };

    const response = await request(app)
      .post('/trip-requests')
      .send(invalidTrip);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION ERROR');
  });

  it('should return VALIDATION ERROR when passengerCount is less than or equal to zero', async () => {
    const invalidTrip = {
      requesterName: "Maria Silva",
      origin: "Parnaiba",
      destination: "Teresina",
      departureAt: "2026-06-24T10:00:00.000Z",
      returnAt: "2026-06-24T18:00:00.000Z",
      purpose: "Meeting",
      passengerCount: 0
    };

    const response = await request(app)
      .post('/trip-requests')
      .send(invalidTrip);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION ERROR');
  });

  it('should return HOLIDAY TRIP NOT ALLOWED when departureAt lands on a national holiday', async () => {
    vi.mocked(holidaysService.isHoliday).mockResolvedValue(true);

    const holidayTrip = {
      requesterName: "Maria Silva",
      origin: "Parnaiba",
      destination: "Teresina",
      departureAt: "2026-01-01T10:00:00.000Z",
      returnAt: "2026-01-02T10:00:00.000Z",
      purpose: "Meeting",
      passengerCount: 2
    };

    const response = await request(app)
      .post('/trip-requests')
      .send(holidayTrip);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('HOLIDAY TRIP NOT ALLOWED');
  });

  it('should return TRIF REQUEST NOT FOUND when searching for a non-existing id', async () => {
    const response = await request(app)
      .get('/trip-requests/id-inexistente-qualquer');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('TRIF REQUEST NOT FOUND');
  });

  it('should cancel an existing trip request and update status to canceled', async () => {
    vi.mocked(holidaysService.isHoliday).mockResolvedValue(false);

    const setupResponse = await request(app)
      .post('/trip-requests')
      .send({
        requesterName: "Erik Vieira",
        origin: "Parnaiba",
        destination: "Teresina",
        departureAt: "2026-08-10T08:00:00.000Z",
        returnAt: "2026-08-12T18:00:00.000Z",
        purpose: "Academic Event",
        passengerCount: 1
      });

    const tripId = setupResponse.body.data.id;

    const response = await request(app)
      .patch(`/trip-requests/${tripId}/cancel`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('canceled');
  });
});
