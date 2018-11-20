/**
 *  PECfunc index
 */

const redis = require('redis')
const redisClient = redis.createClient(config.redis)

redisClient.on('error', function (err) {
  logger.error('redis error event - ' + config.redis.host + ':' +
    config.redis.port + ' - ' + err)
})

module.exports = redisClient