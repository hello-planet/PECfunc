/**
 * login operation
 * status: passed
 */
const crypto = require('crypto')

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    'msg': 'failed'
  }
  var usrExisting = 0
  await redisClient.existsAsync('usr:' + req.body.account).then(function (reply) {
    usrExisting = reply
  }).catch(function (err) {
    logger.error('get usr existence error: ' + err)
  })
  if (usrExisting) {
    var matched = false
    await redisClient.hgetAsync('usr:' + req.body.account, 'password').then(function (reply) {
      matched = crypto.createHash('sha256').update(req.body.password).digest('hex') === reply
    }).catch(function (err) {
      logger.error('get usr password error: ' + err)
    })
    if (matched) {
      var sessionId = crypto.createHash('sha256').update(req.body.account + new Date().getTime()).digest('hex')
      await redisClient.setAsync('id:' + sessionId, req.body.account).then(function (reply) {
        // console.log('set k-v sessionId-account status: ' + reply)
      }).catch(function (err) {
        logger.error('set k-v sessionId-account error: ' + err)
      })
      // persist sessionId for 30 mins
      await redisClient.expireAsync('id:' + sessionId, 1800).then(function (reply) {
        // console.log('set sessionId-account expiration status: ' + reply)
      }).catch(function (err) {
        logger.error('set sessionId-account expiration error: ' + err)
      })
      out.msg = 'passed'
      out['sessionId'] = sessionId
      logger.action(req.body.account + ' logged in.')
    }
  }
  if (out.msg === 'failed'){
    logger.warn('illegal logging in from '+req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
