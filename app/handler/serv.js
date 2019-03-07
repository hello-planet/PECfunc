/**
 * service operations
 * status: passed
 */
const crypto = require('crypto')

// root page(unused)
exports.index = function (req, res) {
  res.send('api server')
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
    logger.error('Error: ' + err)
  })
  await redisClient.onAsync('connect').then(function () {
    logger.log(statusCode.success['712'])
  })
  await redisClient.quitAsync()
}

exports.init = async function () {
  var redisClient = redisServer.createClient(redisCfg)
  // test redis service availability
  redisClient.on('error', function (err) {
    logger.error('Error: ' + err)
  })
  await redisClient.onAsync('connect').then(function () {
    logger.log(statusCode.success['712'])
  })

  logger.seg('--------------------REDIS INITIALIZATION START--------------------')
  // flush all
  await redisClient.flushallAsync().then(function (reply) {
    logger.action('redis flush status: ' + reply)
  })

  // set redis global variables
  await redisClient.msetAsync(
    'global:usrNum', globalVar.usrNum,
    'global:txNum', globalVar.txNum,
    'global:poolNum', globalVar.poolNum,
    'global:blockHeight', globalVar.blockHeight,
    'global:nonce', globalVar.nonce,
    'global:powerUnit', globalVar.powerUnit).then(function (reply) {
    logger.action('redis global strings status: ' + reply)
  }).catch(function (err) {
    logger.error('redis global strings error: ' + err)
  })
  await redisClient.saddAsync('global:usrList', 'default').then(function (reply) {
    logger.action('redis global usrList set status: ' + reply)
  }).catch(function (err) {
    logger.error('redis global usrList set error: ' + err)
  })
  await redisClient.saddAsync('global:txList', 'default').then(function (reply) {
    logger.action('redis global txList set status: ' + reply)
  }).catch(function (err) {
    logger.error('redis global txList set error: ' + err)
  })
  await redisClient.saddAsync('global:poolList', 'default').then(function (reply) {
    logger.action('redis global poolList set status: ' + reply)
  }).catch(function (err) {
    logger.error('redis global poolList set error: ' + err)
  })
  await redisClient.saddAsync('global:finishList', 'default').then(function (reply) {
    logger.action('redis global finishList set status: ' + reply)
  }).catch(function (err) {
    logger.error('redis global finishList set error: ' + err)
  })

  // add default users
  var alice = {
    account: 'alice',
    password: '123456'
  }
  var bob = {
    account: 'bob',
    password: '123456'
  }
  await signup(redisClient, alice)
  await signup(redisClient, bob)
  logger.seg('---------------------REDIS INITIALIZATION END---------------------')
  await redisClient.quitAsync()
}

// show global variables
// TODO need administration permission
exports.show = async function (req, res) {
  var redisClient = redisServer.createClient(redisCfg)
  var out = {
    status: '',
    msg: ''
  }
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
  delete out['msg']
  logger.log(statusCode.success['713'])
  if (out.status !== 713) {
    logger.warn(statusCode.illegal['811'])
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

async function signup (redisClient, usr) {
  var address = crypto.createHash('sha256').update(usr.account + usr.password).digest('hex')
  var password = crypto.createHash('sha256').update(usr.password).digest('hex')
  // write usr
  await redisClient.hmsetAsync('usr:' + usr.account, [
    'account', usr.account,
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
  await redisClient.saddAsync('usr:' + usr.account + ':delivery', 'default').then(function (reply) {
    // console.log('usr delivery list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr delivery list error: ' + err)
  })
  await redisClient.saddAsync('usr:' + usr.account + ':purchase', 'default').then(function (reply) {
    // console.log('usr purchase list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr purchase list error: ' + err)
  })
  // set index from address to account
  await redisClient.setAsync('addr:' + address, usr.account).then(function (reply) {
    // console.log('address-account k-v status: ' + reply)
  }).catch(function (err) {
    logger.error('address-account k-v error: ' + err)
  })
  // change global
  await redisClient.incrAsync('global:usrNum').then(function (reply) {
    // console.log('usr number increment status: ' + reply)
  }).catch(function (err) {
    logger.error('usr number increment error: ' + err)
  })
  await redisClient.saddAsync('global:usrList', usr.account).then(function (reply) {
    // console.log('usr added to global list status: ' + reply)
  }).catch(function (err) {
    logger.error('usr added to global list error: ' + err)
  })
  logger.action('default usr: ' + usr.account + ' write in.')
}
