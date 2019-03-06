/**
 * check the aliveness
 * status: bug remains fixed
 */

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    sessionId: req.params.sessionId,
    msg: 'dead'
  }
  await redisClient.existsAsync('id:' + req.params.sessionId).then(function (reply) {
    if (reply) {
      out.msg = 'alive'
    }
  }).catch(function (err) {
    logger.error('get usr id exisitence error: ' + err)
  })
  await redisClient.quitAsync()
  res.send(out)
}
