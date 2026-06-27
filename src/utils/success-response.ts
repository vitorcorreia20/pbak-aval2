import { Response } from 'express';

export function sendSuccess(res: Response, statusCode: number, data?: any) {
  return res.status(statusCode).json({
    success: true,
    data: data || {}
  });
}