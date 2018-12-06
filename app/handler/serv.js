/**
 * service operations
 */
const config = require('../config/config')
const color = require('../utils/color')

// root page(unused)
exports.index = function (req, res) {
  res.send('<h3 align="center">hello planet</h3>')
  console.log(color.log(new Date() + ' root page visited'))
}

// 404 page
exports.notfound = function (req, res) {
  res.status(404).send('<h3 align="center">Seems you\'ve found something unreal on this planet.</h3>')
  console.log(color.warn(new Date() + ' 404 warning omitted'))
}

// init redis data
exports.init = function (redisClient) {
  console.log(color.seg('----------redis initialization----------'))
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
  console.log(color.seg('----------redis initialization----------'))
}

exports.clean = function () {
  // TODO close server, clean resources used, operate data persistance and close various services
}
