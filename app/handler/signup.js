/**
 * signup operation
 * status: passed
 */

// const pwDemand = require('../config/config').password
const crypto = require('crypto')

module.exports = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    "status": '',
    'msg': ''
  }
  var usrExisting = 1
  await redisClient.existsAsync('usr:' + req.body.account).then(function (reply) {
    // console.log('usr exists status: ' + reply)
    usrExisting = reply
    out.msg = 'failed'
  }).catch(function (err) {
    logger.error('usr exists error: ' + err)
  })
  if (!usrExisting) {
    var address = crypto.createHash('sha256').update(req.body.account + req.body.password).digest('hex')
    var password = crypto.createHash('sha256').update(req.body.password).digest('hex')

    // write usr
    await redisClient.hmsetAsync('usr:' + req.body.account, [
      'account', req.body.account,
      'password', password,
      'balance', 100,
      'address', address,
      'deliveryNum', 0,
      'purchaseNum', 0
    ]).then(function (reply) {
      // console.log('usr main list status: ' + reply)
    }).catch(function (err) {
      logger.error('usr main list error: ' + err)
    })

    // wirte user tx information
    await redisClient.saddAsync('usr:' + req.body.account + ':delivery', 'default').then(function (reply) {
      // console.log('usr delivery list status: ' + reply)
    }).catch(function (err) {
      logger.error('usr delivery list error: ' + err)
    })

    await redisClient.saddAsync('usr:' + req.body.account + ':purchase', 'default').then(function (reply) {
      // console.log('usr purchase list status: ' + reply)
    }).catch(function (err) {
      logger.error('usr purchase list error: ' + err)
    })

    // set index from address to account
    await redisClient.setAsync('addr:' + address, req.body.account).then(function (reply) {
      // console.log('address-account k-v status: ' + reply)
    }).catch(function (err) {
      logger.error('address-account k-v error: ' + err)
    })

    // change global variables
    await redisClient.incrAsync('global:usrNum').then(function (reply) {
      // console.log('usr number increment status: ' + reply)
    }).catch(function (err) {
      logger.error('usr number increment error: ' + err)
    })
    await redisClient.saddAsync('global:usrList', req.body.account).then(function (reply) {
      // console.log('usr added to global list status: ' + reply)
    }).catch(function (err) {
      logger.error('usr added to global list error: ' + err)
    })
    out.msg = 'succeed'
    logger.action(req.body.account + ' signed up.')
  }
  if (out.msg === 'failed'){
    logger.warn('illegal signing up from '+req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}
