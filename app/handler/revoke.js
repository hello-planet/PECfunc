/**
 * invoke the delivered txs.
 * status: unfinished
 */

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: '',
    sessionId: req.params.sessionId
  }
  // TODO
  await redisClient.quitAsync()
  res.send(out)
}