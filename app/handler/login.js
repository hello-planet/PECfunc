/**
 * login operation
 * status: passed
 */
// redis client
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const config = require('../config/config')

const crypto = require('crypto')
const logsys = require('../utils/log')

module.exports = async function (req, res) {
  var redisClient = redis.createClient(config.redis)
  var out = {
    'msg': 'failed'
  }
  var usrExisting = 0
  await redisClient.existsAsync('usr:' + req.body.account).then(function (reply) {
    usrExisting = reply
  }).catch(function (err) {
    logsys.error('get usr existence error: ' + err)
  })
  if (usrExisting) {
    var matched = false
    await redisClient.hgetAsync('usr:' + req.body.account, 'password').then(function (reply) {
      matched = crypto.createHash('sha256').update(req.body.password).digest('hex') === reply
    }).catch(function (err) {
      logsys.error('get usr password error: ' + err)
    })
    if (matched) {
      var sessionId = crypto.createHash('sha256').update(req.body.account + new Date().getTime()).digest('hex')
      await redisClient.setAsync('id:' + sessionId, req.body.account).then(function (reply) {
        // console.log('set k-v sessionId-account status: ' + reply)
      }).catch(function (err) {
        logsys.error('set k-v sessionId-account error: ' + err)
      })
      // persist sessionId for 30 mins
      await redisClient.expireAsync('id:' + sessionId, 1800).then(function (reply) {
        // console.log('set sessionId-account expiration status: ' + reply)
      }).catch(function (err) {
        logsys.error('set sessionId-account expiration error: ' + err)
      })
      out.msg = 'passed'
      out['sessionId'] = sessionId
      logsys.action(req.body.account + ' logged in.')
    }
  }
  if (out.msg === 'failed'){
    logsys.warn('illegal logging in from '+req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
