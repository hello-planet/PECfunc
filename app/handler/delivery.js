/**
 * delivery operation
 * status: passed
 */
const crypto = require('crypto')

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: '',
    sessionId: req.body.sessionId
  }
  let idExisting
  await redisClient.existsAsync('id:' + out.sessionId).then(function (reply) {
    idExisting = reply
    // console.log('get usr id exisitence status: ' + reply)
  }).catch(function (err) {
    logger.error('get usr id exisitence error: ' + err)
  })
  if (idExisting) {
    out.status = 733
    out.msg = statusCode.success['733']
    out['result'] = []
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
    await redisClient.getAsync('id:' + out.sessionId).then(function (reply) {
      // console.log('get usr account name status: OK')
      sellerInfo.account = reply
    }).catch(function (err) {
      logger.error('get usr account name error: ' + err)
    })
    await redisClient.hgetAsync('usr:' + sellerInfo.account, 'address').then(function (reply) {
      // console.log('get usr account address status: OK')
      sellerInfo.toAdd = reply
    }).catch(function (err) {
      logger.error('get usr account address error: ' + err)
    })
    await redisClient.getAsync('global:powerUnit').then(function (reply) {
      // console.log('get global powerUnit status: ' + reply)
      globalVar.powerUnit = reply
    }).catch(function (err) {
      logger.error('get global powerUnit error: ' + err)
    })
    await redisClient.getAsync('global:blockHeight').then(function (reply) {
      // console.log('get global blockHeight status: ' + reply)
      globalVar.blockHeight = reply
    }).catch(function (err) {
      logger.error('get global blockHeight error: ' + err)
    })
    await redisClient.getAsync('global:nonce').then(function (reply) {
      // console.log('get global nonce status: ' + reply)
      globalVar.nonce = reply
    }).catch(function (err) {
      logger.error('get global nonce error: ' + err)
    })
    // write transactions
    for (let tx of req.body.tx) {
      // TODO txHash generation remained or not?
      var txHash = crypto.createHash('sha256').update(sellerInfo.account + new Date().getTime()).digest('hex')
      await redisClient.hmsetAsync('tx:' + txHash, [
        'txHash', txHash,
        'status', 'waiting',
        'blockHeight', globalVar.blockHeight,
        'timestampSell', req.body.timestampSell,
        'timestampBuy', '',
        'timestampExpire', tx.timestampExpire,
        'power', tx.power,
        'value', 0,
        'amount', tx.amount,
        'type', tx.type,
        'from', '',
        'to', sellerInfo.toAdd,
        // TODO determine whether remain the field $(nonce)
        'nonce', globalVar.nonce,
        'inputData', tx.inputData
      ]).then(function (reply) {
        // console.log('set trans hash status: ' + reply)
      }).catch(function (err) {
        logger.error('set trans hash error: ' + err)
      })
      if (tx.value === 0 || tx.value === null || tx.value === '') {
        await redisClient.hsetAsync('tx:' + txHash, 'value', tx.amount * globalVar.powerUnit).then(function (reply) {
          // console.log('set tx value based on amount status(0 means passed): ' + reply)
        }).catch(function (err) {
          logger.error('set tx value based on amount error: ' + err)
        })
      } else {
        await redisClient.hsetAsync('tx:' + txHash, 'value', tx.value).then(function (reply) {
          // console.log('set tx value based on value status(0 means passed): ' + reply)
        }).catch(function (err) {
          logger.error('set tx value based on value error: ' + err)
        })
      }
      // change associated account's variables
      await redisClient.hincrbyAsync('usr:' + sellerInfo.account, 'deliveryNum', 1).then(function (reply) {
        // console.log('increment usr\'s tx number status:' + reply)
      }).catch(function (err) {
        logger.error('increment usr\'s tx number error:' + err)
      })
      await redisClient.saddAsync('usr:' + sellerInfo.account + ':delivery', txHash).then(function (reply) {
        // console.log('add usr\'s tx list status: ' + reply)
      }).catch(function (err) {
        logger.error('add usr\'s tx list error: ' + err)
      })
      // change global variables
      await redisClient.incrAsync('global:txNum').then(function (reply) {
        // console.log('increment global tx number status: ' + reply)
      }).catch(function (err) {
        logger.error('increment global tx number error: ' + err)
      })
      await redisClient.incrAsync('global:poolNum').then(function (reply) {
        // console.log('increment global pool number status: ' + reply)
      }).catch(function (err) {
        logger.error('increment global pool number error: ' + err)
      })
      await redisClient.saddAsync('global:txList', txHash).then(function (reply) {
        // console.log('add global tx list status: ' + reply)
      }).catch(function (err) {
        logger.error('add global tx list error: ' + err)
      })
      await redisClient.saddAsync('global:poolList', txHash).then(function (reply) {
        // console.log('add global pool list status: ' + reply)
      }).catch(function (err) {
        logger.error('add global pool list error: ' + err)
      })
      // generate res.out
      await redisClient.hgetallAsync('tx:' + txHash).then(function (reply) {
        if (reply) {
          // console.log('fetch tx hash back status: OK')
          reply['msg'] = 'succeed'
          out.result.push(reply)
        }
      }).catch(function (err) {
        logger.error('fetch tx hash back error: ' + err)
      })
    }
    logger.action(sellerInfo.account + ' deliveried ' + req.body.tx.length + ' transactions.')
  } else {
    out.status = 834
    out.msg = statusCode.illegal['834']
  }
  if (out.status !== 733) {
    logger.warn('illegal deliverying transactions from ' + req.ip + '\n\t\t\t\t' + 'REQ:  ' + JSON.stringify(req.body) + '\n\t\t\t\t' + 'MSG:  ' + out.msg)
  }
  await redisClient.quitAsync()
  res.send(out)
}
