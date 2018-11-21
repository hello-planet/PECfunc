/* global redisClient */
var redis = require('redis')
var hash = require('hash.js')
var crypto = require('crypto')
const config = require('../config/config')

// TODO fetch data from request
var inputData =
  {
    account: 'alice',
    password: '123456',
    time: ''
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

// TODO new json loginRes
if (redisClient.exists('usr:' + inputData.account, redisClient.print())) {
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
    // TODO write loginRes
  } else {
    // TODO write loginRes
  }
  redisClient.quit()
}
