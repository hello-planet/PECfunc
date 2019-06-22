/**
 * Initialize database with flush when booting for the first time.
 */
const redisServer = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redisServer.RedisClient.prototype)
bluebird.promisifyAll(redisServer.Multi.prototype)

var serverConfig = require('../../config/config')
globalVar = serverConfig.globalVar
logger = require('../log')

let redisClient = redisServer.createClient(serverConfig.redis)
// test redis service availability
redisClient.onAsync('error', function (err) {
  logger.error(serverConfig.status.error['912'] + '' + err)
})

logger.seg('-------------------------DB INITIALIZATION------------------------')
// flush all
redisClient.flushallAsync().then(function (reply) {
  logger.action('redis flush status: ' + reply)
})

// set redis global variables
redisClient.msetAsync(
  'global:usrNum', globalVar.usrNum,
  'global:txNum', globalVar.txNum,
  'global:poolNum', globalVar.poolNum,
  'global:blockHeight', globalVar.blockHeight,
  'global:powerUnit', globalVar.powerUnit
).then(function (reply) {
  logger.action('redis global strings status: ' + reply)
}).catch(function (err) {
  logger.error('redis global strings error: ' + err)
})
redisClient.saddAsync('global:usrList', 'default').then(function (reply) {
  logger.action('redis global usrList set status: ' + reply)
}).catch(function (err) {
  logger.error('redis global usrList set error: ' + err)
})
redisClient.saddAsync('global:txList', 'default').then(function (reply) {
  logger.action('redis global txList set status: ' + reply)
}).catch(function (err) {
  logger.error('redis global txList set error: ' + err)
})
redisClient.saddAsync('global:poolList', 'default').then(function (reply) {
  logger.action('redis global poolList set status: ' + reply)
}).catch(function (err) {
  logger.error('redis global poolList set error: ' + err)
})
redisClient.saddAsync('global:boardList', 'default').then(function (reply) {
  logger.action('redis global boardList set status: ' + reply)
}).catch(function (err) {
  logger.error('redis global boardList set error: ' + err)
})
redisClient.saddAsync('global:finishList', 'default').then(function (reply) {
  logger.action('redis global finishList set status: ' + reply)
}).catch(function (err) {
  logger.error('redis global finishList set error: ' + err)
})
redisClient.saddAsync('global:invalidList', 'default').then(function (reply) {
  logger.action('redis global invalidList set status: ' + reply)
}).catch(function (err) {
  logger.error('redis global revokeList set error: ' + err)
})
redisClient.quitAsync()
