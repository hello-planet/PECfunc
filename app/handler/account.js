/**
 * request for account info
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
    'msg': 'failed'
  }
  var idExisting = 0
  await redisClient.existsAsync('id:' + req.params.sessionId).then(function (reply) {
    idExisting = reply
  }).catch(function (err) {
    logsys.error('get usr id existence error: ' + err)
  })
  if (idExisting) {
    var account = ''
    await redisClient.getAsync('id:' + req.params.sessionId).then(function (reply) {
      account = reply
    }).catch(function (err) {
      logsys.error('get usr account name error: ' + err)
    })
    await redisClient.hgetallAsync('usr:' + account).then(function (reply) {
      out = reply
    }).catch(function (err) {
      logsys.error('get usr account variables error: ' + err)
    })
    delete out['password']
    out['delivery'] = []
    out['purchase'] = []
    await redisClient.smembersAsync('usr:' + account + ':delivery').then(async function (replies) {
      for (let tx of replies) {
        await redisClient.hgetallAsync('tx:' + tx).then(function (reply) {
          if (reply) {
            out.delivery.push(reply)
          }
        }).catch(function (err) {
          logsys.error('get tx from usr:account:delivery error: ' + err)
        })
      }
    }).catch(function (err) {
      logsys.error('get usr:account:delivery status: ' + err)
    })
    await redisClient.smembersAsync('usr:' + account + ':purchase').then(async function (replies) {
      for (let tx of replies) {
        await redisClient.hgetallAsync('tx:' + tx).then(function (reply) {
          if (reply) {
            out.purchase.push(reply)
          }
        }).catch(function (err) {
          logsys.error('get tx from usr:account:purchase error: ' + err)
        })
      }
    }).catch(function (err) {
      logsys.error('get usr:account:purchase status: ' + err)
    })
    out['sessionId'] = req.params.sessionId
    logsys.action(account + ' requested for account info.')
  }
  if (out.msg === 'failed') {
    logsys.warn('illegal fetching acocunt info from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
