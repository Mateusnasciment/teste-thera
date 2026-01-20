/**
 * Erros centralizados da aplicação
 * Padroniza formato de erros e facilita tratamento
 */

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const APP_ERRORS = {
  // Autenticação e Autorização
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Você não está autenticado",
    statusCode: 401,
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "Você não tem permissão para acessar este recurso",
    statusCode: 403,
  },

  // Recursos
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "Recurso não encontrado",
    statusCode: 404,
  },
  RESOURCE_NOT_FOUND: {
    code: "RESOURCE_NOT_FOUND",
    message: "O recurso solicitado não existe ou foi deletado",
    statusCode: 404,
  },

  // Validação
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "Os dados fornecidos são inválidos",
    statusCode: 400,
  },
  INVALID_INPUT: {
    code: "INVALID_INPUT",
    message: "Entrada inválida",
    statusCode: 400,
  },

  // Conflito
  CONFLICT: {
    code: "CONFLICT",
    message: "Recurso já existe",
    statusCode: 409,
  },
  DUPLICATE_EMAIL: {
    code: "DUPLICATE_EMAIL",
    message: "Este email já está cadastrado",
    statusCode: 409,
  },

  // Servidor
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    message: "Erro interno do servidor",
    statusCode: 500,
  },
  DATABASE_ERROR: {
    code: "DATABASE_ERROR",
    message: "Erro ao acessar o banco de dados",
    statusCode: 500,
  },

  // Negócio
  TASK_NOT_FOUND: {
    code: "TASK_NOT_FOUND",
    message: "Task não encontrada ou você não tem permissão para acessá-la",
    statusCode: 404,
  },
  TASK_UNAUTHORIZED: {
    code: "TASK_UNAUTHORIZED",
    message: "Você não pode acessar esta task",
    statusCode: 403,
  },
} as const;

export type AppErrorCode = typeof APP_ERRORS[keyof typeof APP_ERRORS]["code"];

export function createAppError(
  errorKey: keyof typeof APP_ERRORS,
  context?: Record<string, unknown>
): AppError {
  const error = APP_ERRORS[errorKey];
  return new AppError(error.code, error.message, error.statusCode, context);
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
