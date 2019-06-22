/**
 * Populate the database with some test users.
 */
const crypto = require('crypto')

const redisServer = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redisServer.RedisClient.prototype)
bluebird.promisifyAll(redisServer.Multi.prototype)

var serverConfig = require('../../config/config')
logger = require('../log')

let redisClient = redisServer.createClient(serverConfig.redis)
// test redis service availability
redisClient.onAsync('error', function (err) {
  logger.error(serverConfig.status.error['912'] + '' + err)
})

logger.seg('------------------------USR INITIALIZATION------------------------')
for (var usr in serverConfig.testUsr) {
  signup(redisClient, usr, serverConfig.testUsr[usr])
}
redisClient.quitAsync()

function signup (redisClient, usr, password) {
  var address = crypto.createHash('sha256').update(usr + password).digest('hex')
  var password = crypto.createHash('sha256').update(password).digest('hex')
  // write usr
  redisClient.hmsetAsync('usr:' + usr, [
    'account', usr,
    'password', password,
    'balance', 10000,
    'storage', 10000,
    'sk', 0,
    'pk', 0,
    'address', address,
    'deliveryNum', 0,
    'purchaseNum', 0,
    'invalidNum', 0
  ]).then(function (reply) {
    // console.log('usr main list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr main list error: ' + err)
  })
  redisClient.saddAsync('usr:' + usr + ':delivery', 'default').then(function (reply) {
    // console.log('usr delivery list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr delivery list error: ' + err)
  })
  redisClient.saddAsync('usr:' + usr + ':purchase', 'default').then(function (reply) {
    // console.log('usr purchase list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr purchase list error: ' + err)
  })
  redisClient.saddAsync('usr:' + usr + ':demand', 'default').then(function (reply) {
    // console.log('usr demand list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr demand list error: ' + err)
  })
  redisClient.saddAsync('usr:' + usr + ':invalid', 'default').then(function (reply) {
    // console.log('usr invalid list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr invalid list error: ' + err)
  })
  // set index from address to account
  redisClient.setAsync('addr:' + address, usr).then(function (reply) {
    // console.log('address-account k-v status: ' + reply)
  }).catch(function (err) {
    logger.error('address-account k-v error: ' + err)
  })
  // change global
  redisClient.incrAsync('global:usrNum').then(function (reply) {
    // console.log('usr number increment status: ' + reply)
  }).catch(function (err) {
    logger.error('usr number increment error: ' + err)
  })
  redisClient.saddAsync('global:usrList', usr).then(function (reply) {
    // console.log('usr added to global list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr added to global list error: ' + err)
  })
  logger.action('default usr: ' + usr + ' write in.')
}
