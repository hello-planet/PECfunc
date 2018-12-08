/**
 * signup operation
 * status: check the retrive of usr's delivery and purchase lists
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
  if (req.body.msg === 'accountInfo') {
    var idExisting = 0
    await redisClient.existsAsync('id:' + req.body.sessionId).then(function (reply) {
      idExisting = reply
    }).catch(function (err) {
      console.log('Error: ' + err)
    })
    if (idExisting === 1) {
      var account = ''
      await redisClient.getAsync('id:' + req.body.sessionId).then(function (reply) {
        account = reply
      }).catch(function (err) {
        console.log('Error: ' + err)
      })
      await redisClient.hgetallAsync('usr:' + account).then(function (reply) {
        out = reply
      }).catch(function (err) {
        console.log('Error: ' + err)
      })
      delete out['password']
      out['delivery'] = []
      out['purchase'] = []
      await redisClient.smembersAsync('usr:' + account + ':delivery').then(function (replies) {
        replies.forEach(async function (reply) {
          await redisClient.hgetallAsync('tx:' + reply).then(function (reply) {
            if (reply) {
              out.delivery.push(reply)
            }
          }).catch(function (err) {
            console.log('get tx from usr:account:delivery error: ' + err)
          })
        })
      }).catch(function (err) {
        console.log('get usr:account:delivery status: ' + err)
      })
      await redisClient.smembersAsync('usr:' + account + ':purchase').then(function (replies) {
        replies.forEach(async function (reply) {
          await redisClient.hgetallAsync('tx:' + reply).then(function (reply) {
            if (reply) {
              out.purchase.push(reply)
            }
          }).catch(function (err) {
            console.log('get tx from usr:account:purchase error: ' + err)
          })
        })
      }).catch(function (err) {
        console.log('get usr:account:purchase status: ' + err)
      })
      out['sessionId'] = req.body.sessionId
      logsys.action(account + ' requested for account info.')
    }
  }
  await redisClient.quitAsync()
  res.send(out)
}
