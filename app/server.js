/**
 *  PECfunc server
 */
const redis = require('redis')
const config = require('../config/config')
const redisClient = redis.createClient(config.redis)

redisClient.on('error', function (err) {
  logger.error('redis error event - ' + config.redis.host + ':' +
    config.redis.port + ' - ' + err)
})

module.exports = redisClient