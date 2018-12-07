/**
 * login operation
 * status: failed
 */
const crypto = require('crypto')
// redis client
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const config = require('../config/config')
const redisClient = redis.createClient(config.redis)

const logsys = require('../utils/log')

module.exports = async function (req, res) {

}

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

// TODO new json loginRes
if (redisClient.exists('usr:' + inputData.account, redis.print())) {
  redisClient.on('connect', login)
} else {
  // TODO write loginRes
}

// TODO generate the response.

function login () {
  redisClient.hget('usr:' + inputData.account, 'password', passwd = function (err, reply) {
    if (reply) {
      storePassword = reply
    } else {
      console.log('get usr password error: ' + err)
    }
  })
  getPassword = crypto.createHash('sha256').update(inputData.password).digest('hex')
  if (storePassword === getPassword) {
    var sessionID = crypto.createHash('sha256').update(inputData.account + inputData.time).digest('hex')
    redisClient.set(sessionID, inputData.account, function (err, reply) {
      if (reply) {
        console.log('set k-v sessionId-account status: ' + reply)
      } else {
        console.log('set k-v sessionId-account error: ' + err)
      }
    })
    // persit the usr login information for 30 mins
    redisClient.expire(sessionID, 1800, function (err, reply) {
      if (reply) {
        console.log('set sessionId-account expiration status: ' + reply)
      } else {
        console.log('set sessionId-account expiration error: ' + err)
      }
    })
    // TODO write loginRes
  } else {
    // TODO write loginRes
  }
  redisClient.quit()
}

module.exports = function (req, res) {

}
