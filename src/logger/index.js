const { createLogger, format, transports } = require('winston')
const winston = require('winston')
const { errors, splat, combine, timestamp, label, printf, json } = format
const loggerOptions = {
    level: 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        errors({ stack: true }),
        splat(),
        json()
    ),
    defaultMeta: { service: 'remote-proctoring-system Backend' },
    transports: [
        new transports.File({
            filename: '../logs/rps-log-warn.log',
            level: 'warn',
        }),
        new transports.File({
            filename: '../logs/rps-log-error.log',
            level: 'error',
        }),
        new transports.File({ filename: '../logs/rps-log-combined.log' }),
    ],
}
const logger = createLogger(loggerOptions)
if (process.env.NODE_ENV != "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }))
}
module.exports = logger
