const { HealthCheckError } = require('@godaddy/terminus')
const { instance } = require('./db/neo4j')
const log = require('./logger')

function logger(message, error) {
  log.error(`${new Date()}: ${message}: ${error}`)
}

function onSignal() {
  console.log('server is starting cleanup')
  return Promise.all([
    // your clean logic, like closing database connections
    instance.close()
  ])
}

function onShutdown() {
  console.log('cleanup finished, server is shutting down')
}

function healthCheck({ state }) {
  // `state.isShuttingDown` (boolean) shows whether the server is shutting down or not
    const errors = []
    return Promise.all([
      // all your health checks goes here
    ].map(p => p.catch((error) => {
      // silently collecting all the errors
      errors.push(error)
      return undefined
    }))).then(() => {
      if (errors.length) {
        throw new HealthCheckError('healthcheck failed', errors)
      }
    })
    // optionally include a resolve value to be included as
    // info in the health check response
}

const options = {
  // health check options
  healthChecks: {
    '/healthcheck': healthCheck, // a function accepting a state and returning a promise indicating service health,
  },
  // cleanup options
  timeout: 1000, // [optional = 1000] number of milliseconds before forceful exiting
  onSignal, // [optional] cleanup function, returning a promise (used to be onSigterm)
  onShutdown, // [optional] called right before exiting
  // both
  logger,
}

module.exports = options;