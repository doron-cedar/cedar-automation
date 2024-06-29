import * as fs from 'fs';
import * as path from 'path';

// Enum for defining log levels
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export class FileLogger {
  private static instance: FileLogger; 
  private logFilePath: string;  // Path to the log file
  private level: LogLevel;  // Current log level

  private constructor(logFilePath: string, level: LogLevel) {
    this.logFilePath = logFilePath;
    this.level = level;
    this.ensureLogDirectoryExists();
    console.log(`Logger initialized with path: ${logFilePath} and level: ${level}`);
  }

  // Method to get the instance
  static getInstance(logFilePath: string = 'logs/app.log', level: LogLevel = LogLevel.INFO): FileLogger {
    if (!this.instance) {
      this.instance = new FileLogger(logFilePath, level);
    }
    return this.instance;
  }

  // Ensure the log directory exists, create it if it doesn't
  private ensureLogDirectoryExists(): void {
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
      console.log(`Log directory created: ${logDir}`);
    }
  }

  // Check if a message should be logged based on the current log level
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  // Format the log message with a timestamp and log level
  private formatLogMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level.toUpperCase()}]: ${message}\n`;
  }

  // Main log method to write log messages to the file
  private log(level: LogLevel, message: string): void {
    if (this.shouldLog(level)) {
      const formattedMessage = this.formatLogMessage(level, message);
      fs.appendFileSync(this.logFilePath, formattedMessage, 'utf8');
      console.log(`Logged message: ${formattedMessage}`);
    } else {
      console.log(`Message not logged due to log level: ${message}`);
    }
  }

  // Public methods for each log level
  trace(message: string): void {
    this.log(LogLevel.TRACE, message);
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  // Asynchronous method to log request details with optional pretty print
  async logRequestDetailsAsync(
    logMessage: string,
    prettyPrint: boolean = false,
    additionalText: string = '',
  ): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(() => {
        let parsedJSON;
        try {
          if (logMessage.includes('info: Matched Item:')) {
            const jsonString = logMessage.split('info: Matched Item: ')[1];
            parsedJSON = JSON.parse(jsonString);
            logMessage =
              additionalText +
              '\n' +
              JSON.stringify(parsedJSON, null, prettyPrint ? 2 : undefined);
          } else {
            logMessage = additionalText + '\n' + logMessage;
          }
        } catch (error) {
          console.error('Error parsing logMessage as JSON:', error);
          logMessage =
            additionalText +
            '\n' +
            'Original Message (Not Valid JSON):\n' +
            logMessage;
        }

        this.info(logMessage);
        resolve();
      });
    });
  }
}
