/**
 * request for pool info
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
    // console.log('get usr id exisitence status: ' + reply)
    idExisting = reply
  }).catch(function (err) {
    logger.error('get usr id exisitence error: ' + err)
  })
  if (idExisting) {
    out.status = 731
    out.msg = statusCode.success['731']
    out['tx'] = []
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
    let account
    await redisClient.getAsync('id:' + out.sessionId).then(function (reply) {
      account = reply
      logger.action(account + ' requested for pool info.')
    }).catch(function (err) {
      logger.error('get usr account name error: ' + err)
    })
  } else {
    out.status = 831
    out.msg = statusCode.illegal['831']
  }
  if (out.status !== 731) {
    logger.warn('illegal fetching pool info from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
