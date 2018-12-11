/**
 * check the aliveness
 * status: failed
 */
// redis client
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const config = require('../config/config')

const logsys = require('../utils/log')

module.exports = async function (req, res) {
  var redisClient = redis.createClient(config.redis)
  var out = {
    sessionId: req.params.sessionId,
    msg: 'dead'
  }
  await redisClient.existsAsync('id:' + req.params.sessionId).then(function (reply) {
    if (reply) {
      out.msg = 'alive'
    }
  }).catch(function (err) {
    logsys.error('get usr id exisitence error: ' + err)
  })
  await redisClient.quitAsync()
  res.send(out)
}
