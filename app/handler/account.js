/* global redisClient */
var redis = require('redis')
const config = require('../config/config')

// TODO fetch data from request
var inputData =
  {
    sessionId: '',
    msg: 'accountInfo'
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

// TODO new json usrInfo
if ((input.msg === 'accountInfo') && (redisClient.exists(inputData.sessionId))) {
  redisClient.on('connect', showAccount)
} else {
  // TODO write usrInfo
}

function showAccount () {
  account = redisClient.get(inputData.sessionId)
  redisClient.hgetall('usr:' + account, function (err, reply) {
      if (reply) {
        // TODO write usrInfo
        console.log('get usr:account status: ' + reply)
      } else {
        console.log('get usr:account error: ' + err)
      }
    }
  )
  // TODO new json deliveryInfo
  redisClient.smembers('usr:' + account + ':delivery', function (err, replies) {
    if (replies) {
      replies.forEach(function (reply) {
        redisClient.hget(reply, function (err, reply) {
          if (reply) {
            // TODO write deliveryInfo
            console.log('get tx from usr:account:delivery status: ' + reply)
          } else {
            console.log('get tx from usr:account:delivery error: ' + err)
          }
        })
      })
      console.log('get usr:account:delivery status: ' + reply)
    } else {
      console.log('get usr:account:delivery error: ' + err)
    }
  })
  // TODO new json purchseInfo
  redisClient.smembers('usr:' + account + ':purchase', function (err, replies) {
    if (replies) {
      replies.forEach(function (reply) {
        redisClient.hget(reply, function (err, reply) {
          if (reply) {
            // TODO write purchseInfo
            console.log('get tx from usr:account:purchase status: ' + reply)
          } else {
            console.log('get tx from usr:account:purchase error: ' + err)
          }
        })
      })
      console.log('get usr:account:purchase status: ' + reply)
    } else {
      console.log('get usr:account:purchase status: ' + err)
    }
  })
  // TODO write usrInfo
  redisClient.quit()
}
