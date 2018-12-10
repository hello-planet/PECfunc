/**
 * pool operation
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
  if (req.body.msg === 'poolInfo') {
    var idExisting = 0
    await redisClient.existsAsync('id:' + req.body.sessionId).then(function (reply) {
      // console.log('get usr id exisitence status: ' + reply)
      idExisting = reply
    }).catch(function (err) {
      logsys.error('get usr id exisitence error: ' + err)
    })
    if (idExisting) {
      out = {
        'sessionId': req.body.sessionId,
        'tx': []
      }
      await redisClient.smembersAsync('global:poolList').then(async function (replies) {
        for (let tx of replies) {
          await redisClient.hgetallAsync('tx:' + tx).then(function (reply) {
            if (reply) {
              out.tx.push(reply)
            }
          }).catch(function (err) {
            logsys.error('get tx from global:poolList error: ' + err)
          })
        }
        // console.log('get global:poolList status: OK')
      }).catch(function (err) {
        logsys.error('get global:poolList error: ' + err)
      })
      // obtain usr account
      var account = ''
      await redisClient.getAsync('id:' + req.body.sessionId).then(function (reply) {
        account = reply
      }).catch(function (err) {
        logsys.error('get usr account name error: ' + err)
      })
      logsys.action(account + ' requested for pool info.')
    }
  }
  if (out.msg === 'failed') {
    logsys.warn('illegal fetching pool info from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
