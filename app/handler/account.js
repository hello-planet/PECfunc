/**
 * request for account info
 * status: passed
 */

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: '',
    sessionId: req.params.sessionId
  }
  let idExisting
  await redisClient.existsAsync('id:' + out.sessionId).then(function (reply) {
    idExisting = reply
  }).catch(function (err) {
    logger.error('get usr id existence error: ' + err)
  })
  if (idExisting) {
    out.status = 723
    out.msg = statusCode.success['723']
    var account = ''
    await redisClient.getAsync('id:' + out.sessionId).then(function (reply) {
      account = reply
    }).catch(function (err) {
      logger.error('get usr account name error: ' + err)
    })
    await redisClient.hgetallAsync('usr:' + account).then(function (reply) {
      for (let item in reply) {
        out[item] = reply[item]
      }
    }).catch(function (err) {
      logger.error('get usr account variables error: ' + err)
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
          logger.error('get tx from usr:account:delivery error: ' + err)
        })
      }
    }).catch(function (err) {
      logger.error('get usr:account:delivery status: ' + err)
    })
    await redisClient.smembersAsync('usr:' + account + ':purchase').then(async function (replies) {
      for (let tx of replies) {
        await redisClient.hgetallAsync('tx:' + tx).then(function (reply) {
          if (reply) {
            out.purchase.push(reply)
          }
        }).catch(function (err) {
          logger.error('get tx from usr:account:purchase error: ' + err)
        })
      }
    }).catch(function (err) {
      logger.error('get usr:account:purchase status: ' + err)
    })
    logger.action(account + ' requested for account info.')
  } else {
    out.status = 825
    out.msg = statusCode.illegal['825']
  }
  if (out.status !== 723) {
    logger.warn('illegal fetching acocunt info from ' + req.ip + '\n\t\t\t\t' + 'REQ:  ' + JSON.stringify(req.params) + '\n\t\t\t\t' + 'MSG:  ' + out.msg)
  }
  await redisClient.quitAsync()
  res.send(out)
}
