/**
 * purchase operation
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
  if (req.body.msg === 'purchase') {
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
      var buyerInfo = {
        account: '',
        fromAdd: ''
      }
      // fetch buyer's info
      await redisClient.getAsync('id:' + req.body.sessionId).then(function (reply) {
        // console.log('get usr account name status: OK')
        buyerInfo.account = reply
      }).catch(function (err) {
        logsys.error('get usr account name error: OK')
      })
      await redisClient.hgetAsync('usr:' + buyerInfo.account, 'address').then(function (reply) {
        // console.log('get buyer\'s address status: ' + reply)
        buyerInfo.fromAdd = reply
      }).catch(function (err) {
        logsys.log('get usr account address error: ' + err)
      })
      // console.log(buyerInfo)
      // count for number of successful transactions
      var txCount = 0
      // update transactions
      for (let item of req.body.tx) {
        var txHash = item.txHash
        var checkSufficience = {
          txValue: '',
          usrBalance: ''
        }
        await redisClient.hgetAsync('tx:' + txHash, 'value').then(function (reply) {
          // console.log('get tx value status: OK')
          checkSufficience.txValue = reply
        }).catch(function (err) {
          logsys.error('get tx value error: ' + err)
        })
        await redisClient.hgetAsync('usr:' + buyerInfo.account, 'balance').then(function (reply) {
          // console.log('get usr\'s balance status: OK')
          checkSufficience.usrBalance = reply
        }).catch(function (err) {
          logsys.error('get usr\'s balance error: ' + err)
        })
        // console.log(checkSufficience)
        if (parseInt(checkSufficience.usrBalance) < parseInt(checkSufficience.txValue)) {
          var oneTx = {
            txHash: txHash,
            msg: 'failed'
          }
          out.result.push(oneTx)
          txCount += 1
          continue
        }
        // update the transaction
        await redisClient.hmsetAsync('tx:' + txHash, [
          'status', 'succeed',
          'timestampBuy', req.body.timestampBuy,
          'from', buyerInfo.fromAdd
        ]).then(function (reply) {
          // console.log('update the selled tx status: ' + reply)
        }).catch(function (err) {
          logsys.error('update the selled tx error: ' + err)
        })
        // fetch seller accounts' variables
        var sellerInfo = {
          toAdd: '',
          account: ''
        }
        await redisClient.hgetAsync('tx:' + txHash, 'to').then(function (reply) {
          // console.log('get seller\'s address status: OK')
          sellerInfo.toAdd = reply
        }).catch(function (err) {
          logsys.error('get seller\'s address error: ' + err)
        })
        await redisClient.getAsync('addr:' + sellerInfo.toAdd).then(function (reply) {
          // console.log('get seller\'s account status: OK')
          sellerInfo.account = reply
        }).catch(function (err) {
          logsys.error('get seller\'s account error: ' + err)
        })
        // console.log(sellerInfo)
        // change associated accounts' variables
        await redisClient.hincrbyAsync('usr:' + sellerInfo.account, 'balance', checkSufficience.txValue).then(function (reply) {
          // console.log('increase seller\'s balance status: ' + reply)
        }).catch(function (err) {
          logsys.error('increase seller\'s balance status: ' + err)
        })
        await redisClient.hincrbyAsync('usr:' + buyerInfo.account, 'balance', -checkSufficience.txValue).then(function (reply) {
          // console.log('decrease buyer\'s balance status: ' + reply)
        }).catch(function (err) {
          logsys.error('decrease buyer\'s balance status: ' + err)
        })
        await redisClient.hincrbyAsync('usr:' + buyerInfo.account, 'purchaseNum', 1).then(function (reply) {
          // console.log('increase buyer\'s purchase number status: ' + reply)
        }).catch(function (err) {
          logsys.error('increase buyer\'s purchase number error: ' + err)
        })
        await redisClient.saddAsync('usr:' + buyerInfo.account + ':purchase', txHash).then(function (reply) {
          // console.log('append buyer\'s purchase list status: ' + reply)
        }).catch(function (err) {
          logsys.error('append buyer\'s purchase list error: ' + err)
        })
        // change global variables
        await redisClient.decrAsync('global:poolNum').then(function (reply) {
          // console.log('decrease global pool tx number status: ' + reply)
        }).catch(function (err) {
          logsys.error('decrease global pool tx number error: ' + err)
        })
        await redisClient.sremAsync('global:poolList', txHash).then(function (reply) {
          // console.log('remove tx from global pool list status: ' + reply)
        }).catch(function (err) {
          logsys.error('remove tx from global pool list error: ' + err)
        })
        await redisClient.saddAsync('global:finishList', txHash).then(function (reply) {
          // console.log('append tx to global finish list status: ' + reply)
        }).catch(function (err) {
          logsys.error('append tx to global finish list error: ' + err)
        })
        var oneTx = {
          txHash: txHash,
          msg: 'succeed'
        }
        out.result.push(oneTx)
      }
      logsys.action(buyerInfo.account + ' purchased ' + (req.body.tx.length - txCount) + ' transactions.')
    }
  }
  if (out.msg === 'failed') {
    logsys.warn('illegal purchasing transactions from' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
