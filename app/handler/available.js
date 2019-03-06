/**
 * check the tx availabilty
 * status: passed
 */
// redis client
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const config = require('../config/config')

const logsys = require('../utils/log')

module.exports = async function (req, res) {
  var redisClient = redis.createClient(config.redis)
  var out = {
    status: '',
    msg: '',
    txId: req.params.txId
  }
  let txExisting
  await redisClient.existsAsync('tx:' + out.txId).then(function (reply) {
    if (reply) {
      txExisting = reply
    }
  }).catch(function (err) {
    logsys.error('get tx id exisitence error: ' + err)
  })
  if (txExisting) {
    let txPurchased
    await redisClient.sismemberAsync('global:finishList', out.txId).then(function (reply) {
      txPurchased = reply
    }).catch(function (err) {
      logsys.error('get tx finish list error: ' + err)
    })
    if (txPurchased) {
      out.status = 835
      out.msg = 'transaction already purchased'
    } else {
      out.status = 734
      out.msg = 'transaction still available'
    }
  } else {
    out.status = 836
    out.msg = 'transaction undefined'
  }
  await redisClient.quitAsync()
  res.send(out)
}
