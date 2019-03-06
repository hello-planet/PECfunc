/**
 * check the tx availabilty
 * status: passed
 */

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: '',
    txId: req.params.txId
  }
  let txExisting
  await redisClient.existsAsync('tx:' + out.txId).then(function (reply) {
    if (reply) {
      txExisting = reply
    }
  }).catch(function (err) {
    logger.error('get tx id exisitence error: ' + err)
  })
  if (txExisting) {
    let txPurchased
    await redisClient.sismemberAsync('global:finishList', out.txId).then(function (reply) {
      txPurchased = reply
    }).catch(function (err) {
      logger.error('get tx finish list error: ' + err)
    })
    if (txPurchased) {
      out.status = 835
      out.msg = 'transaction already purchased'
    } else {
      out.status = 734
      out.msg = 'transaction still available'
    }
  } else {
    out.status = 836
    out.msg = 'transaction undefined'
  }
  await redisClient.quitAsync()
  res.send(out)
}
