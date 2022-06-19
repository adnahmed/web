const { createLogger, format, transports } = require('winston');
const { errors, splat, combine, timestamp, label, printf, json } = format;
const logger = createLogger({
    level: 'info',
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      errors({ stack: true }),
      splat(),
      json()
    ),
    defaultMeta: { service: 'remote-proctoring-system Backend' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `quick-start-combined.log`.
      // - Write all logs error (and below) to `quick-start-error.log`.
      //
      new transports.File({ filename: 'rps-log-error.log', level: 'error' }),
      new transports.File({ filename: 'rps-log-combined.log' })
    ]
  });

  module.exports = logger;