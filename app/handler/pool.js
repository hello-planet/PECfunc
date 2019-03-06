/**
 * request for pool info
 * status: passed
 */

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    'msg': 'failed'
  }
  var idExisting = 0
  await redisClient.existsAsync('id:' + req.params.sessionId).then(function (reply) {
    // console.log('get usr id exisitence status: ' + reply)
    idExisting = reply
  }).catch(function (err) {
    logger.error('get usr id exisitence error: ' + err)
  })
  if (idExisting) {
    out = {
      'sessionId': req.params.sessionId,
      'tx': []
    }
    await redisClient.smembersAsync('global:poolList').then(async function (replies) {
      for (let tx of replies) {
        await redisClient.hgetallAsync('tx:' + tx).then(function (reply) {
          if (reply) {
            out.tx.push(reply)
          }
        }).catch(function (err) {
          logger.error('get tx from global:poolList error: ' + err)
        })
      }
      // console.log('get global:poolList status: OK')
    }).catch(function (err) {
      logger.error('get global:poolList error: ' + err)
    })
    // obtain usr account
    var account = ''
    await redisClient.getAsync('id:' + req.params.sessionId).then(function (reply) {
      account = reply
    }).catch(function (err) {
      logger.error('get usr account name error: ' + err)
    })
    logger.action(account + ' requested for pool info.')
  }
  if (out.msg === 'failed') {
    logger.warn('illegal fetching pool info from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
