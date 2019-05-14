/**
 * login operation
 * status: passed
 */
const crypto = require('crypto')

module.exports = async function (req, res, next) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: ''
  }
  let usrExisting
  await redisClient.existsAsync('usr:' + req.body.account).then(function (reply) {
    usrExisting = reply
  }).catch(function (err) {
    logger.error('get usr existence error: ' + err)
  })
  if (usrExisting) {
    let writePw
    await redisClient.hgetAsync('usr:' + req.body.account, 'password').then(function (reply) {
      writePw = crypto.createHash('sha256').update(req.body.password).digest('hex') === reply
    }).catch(function (err) {
      logger.error('get usr password error: ' + err)
    })
    if (writePw) {
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
      logger.action(req.body.account + ' logged in.')
      out.status = 722
      out.msg = statusCode.success['722']
      out['sessionId'] = sessionId
    } else {
      out.status = 824
      out.msg = statusCode.illegal['824']
    }
  } else {
    out.status = 823
    out.msg = statusCode.illegal['823']
  }
  if (out.status !== 722) {
    logger.warn('illegal logging in from ' + req.ip + '\n\t\t\t\t' + 'REQ:  ' + JSON.stringify(req.body) + '\n\t\t\t\t' + 'MSG:  ' + out.msg)
  }
  await redisClient.quitAsync()
  res.send(out)
}
