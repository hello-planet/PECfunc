/* global redisClient */
var redis = require('redis')
var crypto = requrie('crypto')
const config = require('../config/config')

// TODO fetch data from request
var inputData =
  {
    'sessionID': '',
    'msg': 'delivery',
    'timestampSell': '',
    'tx': [
      {
        'value': '',
        'amount': '',
        'type': 'wind/light/water',
        'inputData': ''
      }
    ]
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

// TODO new json deliveryRes
if ((inputData.msg === 'purchase') && (redisClient.exists(inputData.sessionId))) {
  // get all trans default variables
  account = redisClient.get(input.sessionId, function (err, reply) {
    if (reply) {
      console.log('get account status: ' + reply)
    } else {
      console.log('get account error: ' + err)
    }
  })
  toAdd = redisClient.hget('usr:' + account, 'address', function (err, reply) {
    if (reply) {
      console.log('get toAdd status: ' + reply)
    } else {
      console.log('get toAdd error: ' + err)
    }
  })
  powerUnit = redisClient.get('global:powerUnit', function (err, reply) {
    if (reply) {
      console.log('get powerUnit status: ' + reply)
    } else {
      console.log('get powerUnit error: ' + err)
    }
  })
  blockHeight = redisClient.get('global:blockHeight', function (err, reply) {
    if (reply) {
      console.log('get blockHeight status: ' + reply)
    } else {
      console.log('get blockHeight error: ' + err)
    }
  })
  nonce = redisClient.get('global:nonce', function (err, reply) {
    if (reply) {
      console.log('get nonce status: ' + reply)
    } else {
      console.log('get nonce error: ' + err)
    }
  })
  // write trans
  redisClient.on('connect', delivery)
} else {
  // TODO write deliveryRes
}

function delivery () {
  inputData.tx.forEach(function (trans, index) {
    txHash = crypto.createHash('sha256').update(account + new Date().getTime()).digest('hex')
    redisClient.hmset('tx:' + txHash, [
        'txHash', txHash,
        'status', 'waiting',
        'blockHeight', blockHeight,
        'timestampSell', inputData.timestampSell,
        'timestampBuy', '',
        'value', trans.value,
        'amount', trans.amount,
        'type', trans.type,
        'from', '',
        'to', toAdd,
        'nonce', nonce,
        'inputData', trans.inputData],
      function (err, reply) {
        if (reply) {
          console.log('set trans hash status: ' + reply)
        } else {
          console.log('set trans hash error: ' + err)
        }
      })
    if (trans.value === '0') {
      redisClient.hset('tx:' + txHash, 'value', trans.amount * powerUnit)
    }
    // change associated account's variables
    redisClient.hincrby('usr:' + account, deliveryNum, 1, function (err, reply) {
      if (reply) {
        console.log('increment usr\'s tx number status:' + reply)
      } else {
        console.log('increment usr\'s tx number error:' + err)
      }
    })
    redisClient.sadd('usr:' + account + ':delivery', txHash, function (err, reply) {
      if (reply) {
        console.log('add usr\'s tx list status: ' + reply)
      } else {
        console.log('add usr\'s tx list error: ' + err)
      }
    })
    // change global variables
    redisClient.incr('global:txNum', function (err, reply) {
      if (reply) {
        console.log('increment global tx number status: ' + reply)
      } else {
        console.log('increment global tx number error: ' + err)
      }
    })
    redisClient.incr('global:poolNum', function (err, reply) {
      if (reply) {
        console.log('increment global pool number status: ' + reply)
      } else {
        console.log('increment global list number error: ' + err)
      }
    })
    redisClient.sadd('global:txList', txHash, function (err, reply) {
      if (reply) {
        console.log('increment global tx list status: ' + reply)
      } else {
        console.log('increment global tx list error: ' + err)
      }
    })
    redisClient.sadd('global:poolList', txHash, function (err, reply) {
      if (reply) {
        console.log('increment global pool list status: ' + reply)
      } else {
        console.log('increment global pool list error: ' + err)
      }
    })
    // TODO new json txInfo
    redisClient.hget('tx:' + txHash, function (err, reply) {
      if (reply) {
        // TODO write txInfo and msg = 'succeed'
        console.log('get tx hash status: ' + reply)
      } else {
        console.log('get tx hash error: ' + err)
      }
    })
    // TODO write deliveryRes
  })
  // TODO write deliveryRes
  redisClient.quit()
}

module.exports = function (req, res) {

}
