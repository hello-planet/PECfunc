/**
 * delivery operation
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
  if (req.body.msg === 'delivery') {
    var idExisting = 0
    await redisClient.existsAsync('id:' + req.body.sessionId).then(function (reply) {
      idExisting = reply
      // console.log('get usr id exisitence status: ' + reply)
    }).catch(function (err) {
      logsys.error('get usr id exisitence error: ' + err)
    })
    if (idExisting) {
      out = {
        'sessionId': req.body.sessionId,
        'result': []
      }
      var sellerInfo = {
        account: '',
        toAdd: ''
      }
      var globalVar = {
        powerUnit: '',
        blockHeight: '',
        nonce: ''
      }
      // fetch necessary variables for transactions
      await redisClient.getAsync('id:' + req.body.sessionId).then(function (reply) {
        // console.log('get usr account name status: OK')
        sellerInfo.account = reply
      }).catch(function (err) {
        logsys.error('get usr account name error: ' + err)
      })
      await redisClient.hgetAsync('usr:' + sellerInfo.account, 'address').then(function (reply) {
        // console.log('get usr account address status: OK')
        sellerInfo.toAdd = reply
      }).catch(function (err) {
        logsys.error('get usr account address error: ' + err)
      })
      await redisClient.getAsync('global:powerUnit').then(function (reply) {
        // console.log('get global powerUnit status: ' + reply)
        globalVar.powerUnit = reply
      }).catch(function (err) {
        logsys.error('get global powerUnit error: ' + err)
      })
      await redisClient.getAsync('global:blockHeight').then(function (reply) {
        // console.log('get global blockHeight status: ' + reply)
        globalVar.blockHeight = reply
      }).catch(function (err) {
        logsys.error('get global blockHeight error: ' + err)
      })
      await redisClient.getAsync('global:nonce').then(function (reply) {
        // console.log('get global nonce status: ' + reply)
        globalVar.nonce = reply
      }).catch(function (err) {
        logsys.error('get global nonce error: ' + err)
      })
      // write transactions
      for (let tx of req.body.tx) {
        var txHash = crypto.createHash('sha256').update(sellerInfo.account + new Date().getTime()).digest('hex')
        await redisClient.hmsetAsync('tx:' + txHash, [
          'txHash', txHash,
          'status', 'waiting',
          'blockHeight', globalVar.blockHeight,
          'timestampSell', req.body.timestampSell,
          'timestampBuy', '',
          'value', tx.value,
          'amount', tx.amount,
          'type', tx.type,
          'from', '',
          'to', sellerInfo.toAdd,
          'nonce', globalVar.nonce,
          'inputData', tx.inputData
        ]).then(function (reply) {
          // console.log('set trans hash status: ' + reply)
        }).catch(function (err) {
          logsys.error('set trans hash error: ' + err)
        })
        if (tx.value === 0) {
          await redisClient.hsetAsync('tx:' + txHash, 'value', tx.amount * globalVar.powerUnit).then(function (reply) {
            // console.log('change tx value based on amount status(0 means passed): ' + reply)
          }).catch(function (err) {
            logsys.error('change tx value based on amount error: ' + err)
          })
        }
        // change associated account's variables
        await redisClient.hincrbyAsync('usr:' + sellerInfo.account, 'deliveryNum', 1).then(function (reply) {
          // console.log('increment usr\'s tx number status:' + reply)
        }).catch(function (err) {
          logsys.error('increment usr\'s tx number error:' + err)
        })
        await redisClient.saddAsync('usr:' + sellerInfo.account + ':delivery', txHash).then(function (reply) {
          // console.log('add usr\'s tx list status: ' + reply)
        }).catch(function (err) {
          logsys.error('add usr\'s tx list error: ' + err)
        })
        // change global variables
        await redisClient.incrAsync('global:txNum').then(function (reply) {
          // console.log('increment global tx number status: ' + reply)
        }).catch(function (err) {
          logsys.error('increment global tx number error: ' + err)
        })
        await redisClient.incrAsync('global:poolNum').then(function (reply) {
          // console.log('increment global pool number status: ' + reply)
        }).catch(function (err) {
          logsys.error('increment global pool number error: ' + err)
        })
        await redisClient.saddAsync('global:txList', txHash).then(function (reply) {
          // console.log('add global tx list status: ' + reply)
        }).catch(function (err) {
          logsys.error('add global tx list error: ' + err)
        })
        await redisClient.saddAsync('global:poolList', txHash).then(function (reply) {
          // console.log('add global pool list status: ' + reply)
        }).catch(function (err) {
          logsys.error('add global pool list error: ' + err)
        })
        // generate res.out
        await redisClient.hgetallAsync('tx:' + txHash).then(function (reply) {
          if (reply) {
            // console.log('fetch tx hash back status: OK')
            reply['msg'] = 'succeed'
            out.result.push(reply)
          }
        }).catch(function (err) {
          logsys.error('fetch tx hash back error: ' + err)
        })
      }
      logsys.action(sellerInfo.account + ' deliveried ' + req.body.tx.length + ' transactions.')
    }
  }
  if (out.msg === 'failed') {
    logsys.warn('illegal deliverying transactions from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
