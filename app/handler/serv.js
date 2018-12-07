/**
 * service operations
 * status : passed
 */
// redis client
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const config = require('../config/config')
const redisClient = redis.createClient(config.redis)

const logsys = require('../utils/log')

// root page(unused)
exports.index = function (req, res) {
  res.send('<h3 align="center">hello planet</h3>')
  logsys.log('root page visited')
}

// 404 page
exports.notfound = function (req, res) {
  res.status(404).send('<h3 align="center">Seems you\'ve found something unreal on this planet.</h3>')
  logsys.warn('404 warning omitted')
}

// init redis data
exports.init = async function () {
  // test redis service availability
  redisClient.on('error', function (err) {
    logsys.error('Error: ' + err)
  })
  await redisClient.onAsync('connect').then(function () {
    logsys.log('Connected to Redis successfully.')
  })
  console.log('--------------------redis initialization--------------------')
  // flush all
  // TODO check the existing data and persist them
  await redisClient.flushallAsync().then(function (reply) {
    logsys.action('redis flush status: ' + reply)
  })
  // set redis global variables
  await redisClient.msetAsync(
    'global:usrNum', config.global.usrNum,
    'global:txNum', config.global.txNum,
    'global:poolNum', config.global.poolNum,
    'global:blockHeight', config.global.blockHeight,
    'global:nonce', config.global.nonce,
    'global:powerUnit', config.global.powerUnit).then(function (reply) {
    logsys.action('redis global strings status: ' + reply)
  }).catch(function (err) {
    logsys.error('redis global strings error: ' + err)
  })
  await redisClient.saddAsync('global:usrList', 'default').then(function (reply) {
    logsys.action('redis global usrList set status: ' + reply)
  }).catch(function (err) {
    logsys.error('redis global usrList set error: ' + err)
  })
  await redisClient.saddAsync('global:txList', 'default').then(function (reply) {
    logsys.action('redis global txList set status: ' + reply)
  }).catch(function (err) {
    logsys.error('redis global txList set error: ' + err)
  })
  await redisClient.saddAsync('global:poolList', 'default').then(function (reply) {
    logsys.action('redis global poolList set status: ' + reply)
  }).catch(function (err) {
    logsys.error('redis global poolList set error: ' + err)
  })
  await redisClient.saddAsync('global:finishList', 'default').then(function (reply) {
    logsys.action('redis global finishList set status: ' + reply)
  }).catch(function (err) {
    logsys.error('redis global finishList set error: ' + err)
  })
  console.log('--------------------redis initialization--------------------')
  redisClient.quit()
}

exports.clean = function () {
  // TODO close server, clean resources used, operate data persistance and close various services
}
