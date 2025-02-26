type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;
  private isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    console.group(prefix);
    console.log(message);
    if (data) {
      console.log('Data:', data);
    }
    console.groupEnd();
  }

  info(message: string, data?: any): void {
    this.formatMessage('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.formatMessage('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.formatMessage('error', message, data);
  }

  debug(message: string, data?: any): void {
    this.formatMessage('debug', message, data);
  }

  apiRequest(config: any): void {
    this.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params
    });
  }

  apiResponse(response: any): void {
    this.info(`API Response: ${response.status} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
  }

  apiError(error: any): void {
    this.error(`API Error: ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
}

export const logger = Logger.getInstance(); 