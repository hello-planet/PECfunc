/**
 * logout operation
 * status: passed
 */

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    'msg': 'failed'
  }
  var idExisting = 0
  await redisClient.existsAsync('id:' + req.body.sessionId).then(function (reply) {
    idExisting = reply
    // console.log('get usr id exisitence status: ' + reply)
  }).catch(function (err) {
    logger.error('get usr id exisitence error: ' + err)
  })
  if (idExisting) {
    // obtain usr account
    var account = ''
    await redisClient.getAsync('id:' + req.body.sessionId).then(function (reply) {
      account = reply
    }).catch(function (err) {
      logger.error('get usr account name error: ' + err)
    })
    await redisClient.delAsync('id:' + req.body.sessionId).then(function (reply) {
      // console.log('delete usr id status: ' + reply)
    }).catch(function (err) {
      logger.error('delete usr id error: ' + err)
    })
    out.msg = 'logout'
    logger.action(account + ' logged out.')
  }
  if (out.msg === 'failed') {
    logger.warn('illegal logging out from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
