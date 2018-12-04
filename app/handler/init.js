/* global redisClient */
const config = require('../config/config')
const color = require('../utils/color')

exports.init = function (redisClient) {
  console.log(color.log('----------server initialization----------'))
  // flush all
  // TODO check the existing data and persist them
  redisClient.flushall()

  // set global variables
  redisClient.mset(
    'global:usrNum', config.global.usrNum,
    'global:txNum', config.global.txNum,
    'global:poolNum', config.global.poolNum,
    'global:blockHeight', config.global.blockHeight,
    'global:nonce', config.global.nonce,
    'global:powerUnit', config.global.powerUnit,
    function (err, reply) {
      if (reply) {
        console.log(color.action('global strings status: ' + reply))
      } else {
        console.log(color.error('global strings error: ' + err))
      }
    })

  redisClient.sadd('global:usrList', 'default', function (err, reply) {
    if (reply) {
      console.log(color.action('usrList set status: ' + reply))
    } else {
      console.log(color.error('usrList set error: ' + err))
    }
  })
  redisClient.sadd('global:txList', 'default', function (err, reply) {
    if (reply) {
      console.log(color.action('txList set status: ' + reply))
    } else {
      console.log(color.error('txList set error: ' + err))
    }
  })
  redisClient.sadd('global:poolList', 'default', function (err, reply) {
    if (reply) {
      console.log(color.action('poolList set status: ' + reply))
    } else {
      console.log(color.error('poolList set error: ' + err))
    }
  })
  redisClient.sadd('global:finishList', 'default', function (err, reply) {
    if (reply) {
      console.log(color.action('finishList set status: ' + reply))
    } else {
      console.log(color.error('finishList set error: ' + err))
    }
  })
  console.log(color.log('----------server initialization----------'))
}