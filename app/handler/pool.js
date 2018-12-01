/* global redisClient */
var redis = require('redis')
const config = require('../config/config')

// TODO fetch data from request
var inputData =
  {
    sessionId: '',
    msg: 'poolInfo'
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

// TODO new json poolInfo
if ((input.msg === 'poolInfo') && (redisClient.exists(inputData.sessionId))) {
  redisClient.on('connect', showPool)
} else {
  // TODO write poolInfo
}

function showPool () {
  // TODO new json txList
  redisClient.smembers('global:poolList', function (err, replies) {
    if (replies) {
      replies.forEach(function (reply) {
        redisClient.hgetall('tx:' + reply, function (err, reply) {
          if (reply) {
            // TODO write txList
            console.log('get tx from global:poolList status: ' + reply)
          } else {
            console.log('get tx from global:poolList error: ' + err)
          }
        })
      })
      console.log('get global:poolList status: ' + reply)
    } else {
      console.log('get global:poolList error: ' + err)
    }
  })
  // TODO write poolInfo
  redisClient.quit()
}