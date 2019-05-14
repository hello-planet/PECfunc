/**
 * service operations
 * status: passed
 */
const crypto = require('crypto')

// root page(unused)
exports.index = function (req, res) {
  res.send('the api server is running.\n')
  logger.log('root page visited')
}

// 404 page
exports.notfound = function (req, res) {
  res.status(404).send('It seems that you\'ve found something unreal on this planet. :D')
  logger.warn('404 warning omitted')
}

// test database connection
exports.testCon = async function () {
  var redisClient = redisServer.createClient(redisCfg)
  // test redis service availability
  redisClient.on('error', function (err) {
    logger.error(statusCode.error['912'] + ' ' + err)
  })
  await redisClient.onAsync('connect').then(function () {
    logger.log(statusCode.success['712'])
  })
  await redisClient.quitAsync()
}

// show global variables
// TODO need a safer administration permission
exports.show = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: ''
  }
  if (req.params.adminId === crypto.createHash('sha256').update(serverConfig.admin.password).digest('hex')) {
    out.status = 713
    out.msg = statusCode.success['713']
    await redisClient.getAsync('global:usrNum').then(function (reply) {
      out['usrNum'] = reply
    }).catch(function (err) {
      logger.error('get global usrNum error: ' + err)
    })
    await redisClient.getAsync('global:poolNum').then(function (reply) {
      out['poolNum'] = reply
    }).catch(function (err) {
      logger.error('get global poolNum error: ' + err)
    })
    await redisClient.getAsync('global:txNum').then(function (reply) {
      out['txNum'] = reply
    }).catch(function (err) {
      logger.error('get global txNum error: ' + err)
    })
    out['usrList'] = []
    await redisClient.smembersAsync('global:usrList').then(function (replies) {
      replies.forEach(async function (reply) {
        if (reply !== 'default') {
          out.usrList.push(reply)
        }
      })
    }).catch(function (err) {
      logger.error('get global usr list error: ' + err)
    })
    out['poolList'] = []
    await redisClient.smembersAsync('global:poolList').then(function (replies) {
      replies.forEach(async function (reply) {
        if (reply !== 'default') {
          out.poolList.push(reply)
        }
      })
    }).catch(function (err) {
      logger.error('get global pool list error: ' + err)
    })
    out['finishList'] = []
    await redisClient.smembersAsync('global:finishList').then(function (replies) {
      replies.forEach(async function (reply) {
        if (reply !== 'default') {
          out.finishList.push(reply)
        }
      })
    }).catch(function (err) {
      logger.error('get global finish list error: ' + err)
    })
    out['txList'] = []
    await redisClient.smembersAsync('global:txList').then(function (replies) {
      replies.forEach(async function (reply) {
        if (reply !== 'default') {
          out.txList.push(reply)
        }
      })
    }).catch(function (err) {
      logger.error('get global tx list error: ' + err)
    })
    await redisClient.getAsync('global:blockHeight').then(function (reply) {
      out['blockHeight'] = reply
    }).catch(function (err) {
      logger.error('get global blockHeight error: ' + err)
    })
    await redisClient.getAsync('global:nonce').then(function (reply) {
      out['nonce'] = reply
    }).catch(function (err) {
      logger.error('get global nonce error: ' + err)
    })
    await redisClient.getAsync('global:powerUnit').then(function (reply) {
      out['powerUnit'] = reply
    }).catch(function (err) {
      logger.error('get global powerUnit error: ' + err)
    })
    logger.log(statusCode.success['713'])
  } else {
    out.status = 811
    out.msg = statusCode.illegal['811']
  }
  if (out.status !== 713) {
    logger.warn('illegal fetching global data from ' + req.ip)
  }
  await redisClient.quitAsync()
  res.send(out)
}

// persist data into disk before server shutdown
exports.save = async function () {
  var redisClient = redisServer.createClient(serverConfig.redis)
  var out = {
    'msg': 'failed to save data to disk.'
  }
  await redisClient.saveAsync().then(function (reply) {
    out.msg = 'all data saved to disk status:' + reply
    logger.log(statusCode.success['714'])
  }).catch(function (err) {
    logger.error(statusCode.illegal['812'] + err)
  })
  await redisClient.quitAsync()
  res.send(out)
}
