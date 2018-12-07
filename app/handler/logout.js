/* global redisClient */
var redis = require('redis')
const config = require('../config/config')

// TODO fetch data from request
var inputData =
  {
    'sessionId': '',
    'msg': 'logout'
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

module.exports = function (req, res) {

}
