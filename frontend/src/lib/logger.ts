/**
 * Logger centralizado para toda a aplicação
 * Facilita debugging, logging estruturado e integração com serviços
 */

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private isDev = process.env.NODE_ENV === "development";

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error): void {
    const prefix = `[${level.toUpperCase()}]`;
    const timestamp = this.formatTimestamp();

    switch (level) {
      case "info":
        console.log(`${prefix} ${timestamp} - ${message}`, data || "");
        break;
      case "warn":
        console.warn(`${prefix} ${timestamp} - ${message}`, data || "");
        break;
      case "error":
        console.error(`${prefix} ${timestamp} - ${message}`, error || data || "");
        break;
      case "debug":
        if (this.isDev) {
          console.debug(`${prefix} ${timestamp} - ${message}`, data || "");
        }
        break;
    }
  }

  info(message: string, data?: unknown): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error | unknown, data?: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    this.log("error", message, data, err);
  }

  debug(message: string, data?: unknown): void {
    this.log("debug", message, data);
  }
}

export const logger = new Logger();
