/* global redisClient */
var redis = require('redis')
var crypto = require('crypto')
const config = require('../config/config')

var existing = 0

// TODO fetch signup data from request
var inputData =
  {
    account: 'bob',
    password: '123456',
    address: ''
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

redisClient.on('connect', existAccount)

if (existing) {
  redisClient.on('connect', generateResponse)
} else {
  inputData.address = crypto.createHash('sha256').update(inputData.account + inputData.password).digest('hex')
  inputData.password = crypto.createHash('sha256').update(inputData.password).digest('hex')

  // write the usr and generate the response
  redisClient.on('connect', writeUser)
  redisClient.on('connect', changeGlobal)
  redisClient.on('connect', generateResponse)
}

function writeUser () {
  redisClient.hmset('usr:' + inputData.account, [
      'account', inputData.account,
      'password', inputData.password,
      'balance', 100,
      'address', inputData.address,
      'deliveryNum', 0,
      'purchaseNum', 0],
    function (err, reply) {
      if (reply) {
        console.log('usr main list status: ' + reply)
      } else {
        console.log('usr main list error: ' + err)
      }
    })
  redisClient.sadd('usr:' + inputData.account + ':delivery', 'default', function (err, reply) {
    if (reply) {
      console.log('usr delivery list status: ' + reply)
    } else {
      console.log('usr delivery list error: ' + err)
    }
  })
  redisClient.sadd('usr:' + inputData.account + ':purchase', 'default', function (err, reply) {
    if (reply) {
      console.log('usr purchase list status: ' + reply)
    } else {
      console.log('usr purchase list error: ' + err)
    }
  })
  // set index from address to account
  redisClient.set('addr:' + inputData.address, inputData.account, function (err, reply) {
    if (reply) {
      console.log('address-account k-v status: ' + reply)
    } else {
      console.log('address-account k-v error: ' + err)
    }
  })
}

function changeGlobal () {
  redisClient.incr('global:usrNum', function (err, reply) {
    if (reply) {
      console.log('usr number increment status: ' + reply)
    } else {
      console.log('usr number increment error: ' + err)
    }
  })
  redisClient.sadd('global:usrList', inputData.account, function (err, reply) {
    if (reply) {
      console.log('usr added to global list status: ' + reply)
    } else {
      console.log('usr added to global list error: ' + err)
    }
  })
}

function existAccount () {
  redisClient.exists('usr:' + inputData.account, function (err, reply) {
    if (reply) {
      console.log('usr exists status: ' + reply)
      // TODO to change the global variables
      this.existing = true
    } else {
      console.log('usr exists status: ' + err)
    }
  })
}

function generateResponse () {
  // TODO generate the response. Successfully signup or user already exists.
  if (existing) {
    //user already exists
    console.log('reponse: failed')
  } else {
    //Successfully signup
    console.log('response: successed')
  }
  redisClient.quit()
}
