/* global redisClient */
var redis = require('redis')
const config = require('./config/config')

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error:' + err)
})

redisClient.on('connect', initGlobal)

function initGlobal () {
  // flush all
  // TODO check the existing data and persist them
  redisClient.flushall()

  // set global variables
  redisClient.mset(
    'global:usrNum', 0,
    'global:txNum', 0,
    'global:poolNum', 0,
    'global:blockHeight', 1,
    'global:nonce', 1117,
    'global:powerUnit', 0.5,
    function (err, reply) {
      if (reply) {
        console.log('global values status: ' + reply)
      } else {
        console.log('error: ' + err)
      }
    })
  redisClient.sadd('global:usrList', 'default', function (err, reply) {
    if (reply) {
      console.log('usrList status: ' + reply)
    } else {
      console.log('error: ' + err)
    }
  })
  redisClient.sadd('global:txList', 'default', function (err, reply) {
    if (reply) {
      console.log('txList status: ' + reply)
    } else {
      console.log('error: ' + err)
    }
  })
  redisClient.sadd('global:poolList', 'default', function (err, reply) {
    if (reply) {
      console.log('poolList status: ' + reply)
    } else {
      console.log('error: ' + err)
    }
  })
  redisClient.sadd('global:finishList', 'default', function (err, reply) {
    if (reply) {
      console.log('finishList status: ' + reply)
    } else {
      console.log('error: ' + err)
    }
  })
  redisClient.quit()
}
