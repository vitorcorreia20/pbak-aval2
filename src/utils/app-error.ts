export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(errorCode: string, message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    // Mantém o protótipo correto no TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
