import { LoggerService, Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable()
export class MyLogger implements LoggerService {
    private context?: string;
    private logger: Logger;

    constructor() {
        this.context = undefined;
        this.logger = createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            // format: format.combine(
            //     format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            //     format.errors({ stack: true }),
            //     format.colorize(),
            //     format.printf(({ timestamp, level, message, context, stack }) => {
            //         const contextStr = context ? `[${context}]` : '';
            //         return `${timestamp} ${level}${contextStr}: ${message}${stack ? `\n${stack}` : ''}`;
            //     })
            // ),
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
                        format.printf(({ timestamp, level, message, context }) => {
                            const strApp = chalk.green('[Nest]');
                            const strContext = chalk.yellow(`[${context}]`);
                            
                            return `${strApp} - ${timestamp} ${level} ${strContext} ${message}`; 
                        })
                    )
                }),
                new transports.File({ 
                    format: format.combine(
                        format.timestamp(),
                        format.json()
                    ),
                    dirname: 'logs',
                    filename: 'dev.log' 
                })
            ]
        });
    }

    /**
     * Write a 'log' level log.
     */
    log(message: any, context?: string) {
        const logContext = context || this.context;
        this.logger.info(this.formatMessage(message), { context: logContext });
    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, trace?: string, context?: string) {
        const logContext = context || this.context;
        const errorObj = trace ? new Error(this.formatMessage(message)) : undefined;
        if (errorObj && trace) {
            errorObj.stack = trace;
        }
        this.logger.error(this.formatMessage(message), { 
            context: logContext, 
            stack: trace 
        });
    }

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, context?: string) {
        const logContext = context || this.context;
        this.logger.warn(this.formatMessage(message), { context: logContext });
    }

    /**
     * Write a 'debug' level log.
     */
    debug(message: any, context?: string) {
        const logContext = context || this.context;
        this.logger.debug(this.formatMessage(message), { context: logContext });
    }

    /**
     * Write a 'verbose' level log.
     */
    verbose(message: any, context?: string) {
        const logContext = context || this.context;
        this.logger.verbose(this.formatMessage(message), { context: logContext });
    }

    /**
     * Set log levels.
     */
    setLogLevels(levels: string[]) {
        // Winston handles log levels automatically
        // Can be extended to dynamically change log levels if needed
        if (levels.length > 0) {
            this.logger.level = levels[0];
        }
    }

    /**
     * Format log message
     */
    private formatMessage(message: any): string {
        if (typeof message === 'object') {
            return JSON.stringify(message, null, 2);
        }
        return String(message);
    }

    /**
     * Set context for this logger instance
     */
    setContext(context: string): void {
        this.context = context;
    }

    /**
     * Create a new logger instance with context
     */
    static withContext(context: string): MyLogger {
        const logger = new MyLogger();
        logger.setContext(context);
        return logger;
    }
}