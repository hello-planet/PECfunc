/**
 * signup operation
 * status: passed
 */
// redis client
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const config = require('../config/config')

const crypto = require('crypto')
const logsys = require('../utils/log')

module.exports = async function (req, res) {
  var redisClient = redis.createClient(config.redis)
  var out = {
    'msg': 'failed'
  }
  var existing = 1
  await redisClient.existsAsync('usr:' + req.body.account).then(function (reply) {
    console.log('usr exists status: ' + reply)
    existing = reply
  }).catch(function (err) {
    console.log('usr exists error: ' + err)
  })
  if (existing === 0) {
    var address = crypto.createHash('sha256').update(req.body.account + req.body.password).digest('hex')
    var password = crypto.createHash('sha256').update(req.body.password).digest('hex')

    // write usr
    await redisClient.hmsetAsync('usr:' + req.body.account, [
      'account', req.body.account,
      'password', password,
      'balance', 100,
      'address', address,
      'deliveryNum', 0,
      'purchaseNum', 0]).then(function (reply) {
      console.log('usr main list status: ' + reply)
    }).catch(function (err) {
      console.log('usr main list error: ' + err)
    })

    await redisClient.saddAsync('usr:' + req.body.account + ':delivery', 'default').then(function (reply) {
      console.log('usr delivery list status: ' + reply)
    }).catch(function (err) {
      console.log('usr delivery list error: ' + err)
    })

    await redisClient.saddAsync('usr:' + req.body.account + ':purchase', 'default').then(function (reply) {
      console.log('usr purchase list status: ' + reply)
    }).catch(function () {
      console.log('usr purchase list error: ' + err)
    })

    // set index from address to account
    await redisClient.setAsync('addr:' + address, req.body.account).then(function (reply) {
      console.log('address-account k-v status: ' + reply)
    }).catch(function (err) {

      console.log('address-account k-v error: ' + err)
    })

    // change global
    await redisClient.incrAsync('global:usrNum').then(function (reply) {
      console.log('usr number increment status: ' + reply)
    }).catch(function (err) {
      console.log('usr number increment error: ' + err)
    })
    await redisClient.saddAsync('global:usrList', req.body.account).then(function (reply) {
      console.log('usr added to global list status: ' + reply)
    }).catch(function (err) {
      console.log('usr added to global list error: ' + err)
    })
    out.msg = 'succeed'
    logsys.action(req.body.account + ' signed up')
  }
  await redisClient.quitAsync()
  res.send(out)
}
