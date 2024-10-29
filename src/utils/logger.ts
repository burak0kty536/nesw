type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      switch (level) {
        case 'info':
          console.log(formattedMessage, ...args);
          break;
        case 'warn':
          console.warn(formattedMessage, ...args);
          break;
        case 'error':
          console.error(formattedMessage, ...args);
          break;
        case 'debug':
          console.debug(formattedMessage, ...args);
          break;
      }
    }
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }
}

export const logger = Logger.getInstance();