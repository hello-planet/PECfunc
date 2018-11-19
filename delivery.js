/* global redisClient */
var redis = require('redis')
const config = require('./conf/config')

// TODO fetch data from request
var inputData =
  {
    'sessionID': '',
    'msg': 'delivery',
    'timestampSell': '',
    'tx': [
      {
        'value': '',
        'amount': '',
        'type': 'wind/light/water',
        'inputData': ''
      }
    ]
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

redisClient.quit()