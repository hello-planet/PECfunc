/**
 * logout operation
 * status: passed
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
    'msg': 'failed'
  }
  if (req.body.msg === 'logout') {
    var idExisting = 0
    await redisClient.existsAsync('id:' + req.body.sessionId).then(function (reply) {
      idExisting = reply
      // console.log('get usr id exisitence status: ' + reply)
    }).catch(function (err) {
      logsys.error('get usr id exisitence error: ' + err)
    })
    if (idExisting) {
      // obtain usr account
      var account = ''
      await redisClient.getAsync('id:' + req.body.sessionId).then(function (reply) {
        account = reply
      }).catch(function (err) {
        logsys.error('get usr account name error: ' + err)
      })
      await redisClient.delAsync('id:' + req.body.sessionId).then(function (reply) {
        // console.log('delete usr id status: ' + reply)
      }).catch(function (err) {
        logsys.error('delete usr id error: ' + err)
      })
      out.msg = 'logout'
      logsys.action(account + ' logged out.')
    }
  }
  if (out.msg === 'failed') {
    logsys.warn('illegal logging out from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
