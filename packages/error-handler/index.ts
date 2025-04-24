export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}
//  Not Found Error
export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

// Validation Error  (use for Joi/zod/react-hook-form Validation Error)
export class ValidationError extends AppError {
  constructor(message = 'Validation Error', details?: any) {
    super(message, 400, true, details);
  }
}

// Authentication Error
export class AuthError extends AppError {
  constructor(message = 'Unauthorizes') {
    super(message, 401);
  }
}

// Forbidden Error (For Insufficient Permission)
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// Database Error (For MongoDB/Postgres Error)
export class DatabaseError extends AppError {
  constructor(message = 'Database Error', details?: any) {
    super(message, 500);
  }
}

// Rate Limit Error  (If User exceeds API Limits)
export class RateLimitError extends AppError {
  constructor(message = 'Rate Limit Exceeded') {
    super(message, 429);
  }
}
