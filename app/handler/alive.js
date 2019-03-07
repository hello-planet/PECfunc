/**
 * check the aliveness
 * status: bug remains fixed
 */

// TODO extend user expiration time
module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: '',
    sessionId: req.params.sessionId
  }
  await redisClient.existsAsync('id:' + out.sessionId).then(function (reply) {
    if (reply) {
      out.status = 725
      out.msg = statusCode.success['725']
    } else {
      out.status = 826
      out.msg = statusCode.illegal['826']
    }
  }).catch(function (err) {
    logger.error('get usr id exisitence error: ' + err)
  })
  await redisClient.quitAsync()
  res.send(out)
}
