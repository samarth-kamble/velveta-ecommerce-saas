export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

// Validation Error(Use for Joi/Zod/react-hook-form validation errors)
export class ValidationError extends AppError {
  constructor(message = "Validation request data", details?: any) {
    super(message, 400, true, details);
  }
}

// Authentication Error
export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// Forbidden Error (For Insufficient permissions)
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// Database Error (For MongoDB/PostgreSQL errors)
export class DatabaseError extends AppError {
  constructor(message = "Database error", details?: any) {
    super(message, 500, false, details);
  }
}

// Rate Limit Error (For too many requests)
export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}
