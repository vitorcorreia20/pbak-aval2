import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';

export function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Se for um erro gerado propositadamente pela nossa aplicação (ex: validação)
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message
      }
    });
  }

  // Log interno para a equipa debugar (nunca exposto ao utilizador final)
  console.error('Unhandled Error:', error);

  // Se for um erro inesperado (ex: falha na base de dados)
  return response.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal error occurred'
    }
  });
}