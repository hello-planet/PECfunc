/**
 * invoke the delivered tx.
 * status: passed
 */

module.exports = async function (req, res) {
  let redisClient = redisServer.createClient(redisCfg)
  let out = {
    status: '',
    msg: '',
    sessionId: req.params.sessionId,
    txId: req.params.txId
  }
  let idExisting
  await redisClient.existsAsync('id:' + out.sessionId).then(function (reply) {
    idExisting = reply
  }).catch(function (err) {
    logger.error('get usr id exisitence error: ' + err)
  })
  if (idExisting) {
    // fetch seller account name
    let sellerAccount
    await redisClient.getAsync('id:' + out.sessionId).then(function (reply) {
      // console.log('get usr account name status: OK')
      sellerAccount = reply
    }).catch(function (err) {
      logger.error('get usr account name error: ' + err)
    })

    // fetch tx in user's list
    let txExisting
    await redisClient.sismemberAsync('usr:' + sellerAccount + ':delivery', out.txId).then(function (reply) {
      txExisting = reply
    }).catch(function (err) {
      logger.error('tx existing error: ' + err)
    })
    if (txExisting) {
      let txStatus
      await redisClient.hgetAsync('tx:' + out.txId, 'status').then(function (reply) {
        txStatus = reply
      }).catch(function (err) {
        logger.error('get tx status error: ' + err)
      })
      if (txStatus === 'waiting') {
        // usr
        await redisClient.hincrbyAsync('usr:' + sellerAccount, 'revokeNum', 1).then(function (reply) {
          // console.log('increment usr\'s tx number status:' + reply)
        }).catch(function (err) {
          logger.error('increment usr\'s tx number error:' + err)
        })
        await redisClient.saddAsync('usr:' + sellerAccount + ':revoke', out.txId).then(function (reply) {
          // console.log('add usr\'s tx list status: ' + reply)
        }).catch(function (err) {
          logger.error('add usr\'s tx list error: ' + err)
        })
        await redisClient.sremAsync('usr:' + sellerAccount + ':delivery', out.txId).then(function (reply) {
          // console.log('remove tx from global pool list status: ' + reply)
        }).catch(function (err) {
          logger.error('remove tx from global pool list error: ' + err)
        })

        // tx
        await redisClient.hsetAsync('tx:' + out.txId, 'status', 'revoked').then(function (reply) {
          // console.log('update the selled tx status: ' + reply)
        }).catch(function (err) {
          logger.error('update the revoked tx error: ' + err)
        })

        // global
        await redisClient.decrAsync('global:poolNum').then(function (reply) {
          // console.log('decrease global pool tx number status: ' + reply)
        }).catch(function (err) {
          logger.error('decrease global pool tx number error: ' + err)
        })
        await redisClient.sremAsync('global:poolList', out.txId).then(function (reply) {
          // console.log('remove tx from global pool list status: ' + reply)
        }).catch(function (err) {
          logger.error('remove tx from global pool list error: ' + err)
        })
        await redisClient.saddAsync('global:revokeList', out.txId).then(function (reply) {
          // console.log('append tx to global revoke list status: ' + reply)
        }).catch(function (err) {
          logger.error('append tx to global revoke list error: ' + err)
        })
        out.status = 735
        out.msg = statusCode.success['735']
        logger.action(sellerAccount + ' revoked 1 transaction.')
      } else {
        out.status = 839
        out.msg = statusCode.illegal['839']
      }
    } else {
      out.status = 838
      out.msg = statusCode.illegal['838']
    }
  } else {
    out.status = 837
    out.msg = statusCode.illegal['837']
  }
  if (out.status !== 735) {
    logger.warn('illegal revoking transaction from ' + req.ip + '\n\t\t\t\t' + 'REQ:  ' + JSON.stringify({
      sessionId: out.sessionId,
      txId: out.txId
    }) + '\n\t\t\t\t' + 'MSG:  ' + out.msg)
  }
  await redisClient.quitAsync()
  res.send(out)
}
