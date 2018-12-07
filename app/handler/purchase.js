/* global redisClient */
var redis = require('redis')
const config = require('../config/config')

// TODO fetch data from request
var inputData =
  {
    'sessionID': '',
    'msg': 'purchase',
    'timestampBuy': '',
    'tx': [
      {
        'txhash': ''
      }
    ]
  }

redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log('error: ' + err)
})

// TODO new json purchaseRes
if ((inputData.msg === 'purchase') && (redisClient.exists(inputData.sessionId))) {
  account = redisClient.get(input.sessionId, function (err, reply) {
    if (reply) {
      console.log('get session id status: ' + reply)
    } else {
      console.log('get session id error: ' + err)
    }
  })
  fromAdd = redisClient.hget('usr:' + account, address, function (err, reply) {
    if (reply) {
      console.log('get fromAdd status:' + reply)
    } else {
      console.log('get fromAdd error:' + err)
    }
  })
  // write trans
  redisClient.on('connect', purchase)
} else {
  // TODO write purchaseRes
}

function purchase () {
  inputData.tx.forEach(function (trans, index) {
    txHash = 'tx:' + trans
    txValue = redisClient.hget(txHash, 'value', function (err, reply) {
      if (reply) {
        console.log('get tx value status: ' + reply)
      } else {
        console.log('get tx value error: ' + err)
      }
    })
    usrBalance = redisClient.hget('usr:' + account, 'balance', function (err, reply) {
      if (reply) {
        console.log('get usr balance status: ' + reply)
      } else {
        console.log('get usr balance error: ' + err)
      }
    })
    // TODO new json txInfo
    if (txValue > usrBalance) {
      // TODO write txInfo msg = 'insufficient balance'
    } else {
      // change tx variables
      redisClient.hmset(txHash, [
          'status', 'succeed',
          'timestampBuy', inputData.timestampBuy,
          'from', fromAdd],
        function (err, reply) {
          if (reply) {
            console.log('change tx variables status: ' + reply)
          } else {
            console.log('change tx variables error: ' + err)
          }
        })

      // change associated accounts' variables
      toAdd = redis.hget(txHash, 'to')
      sellAccount = redis.get('addr:' + toAdd)
      redisClient.hincrby('usr:' + sellAccount, 'balance', txValue, function (err, reply) {
        if (reply) {
          console.log('get usr balance status: ' + reply)
        } else {
          console.log('get usr balance error: ' + err)
        }
      })
      redisClient.hincrby('usr:' + account, 'balance', -txValue, function (err, reply) {
        if (reply) {
          console.log('get usr balance status: ' + reply)
        } else {
          console.log('get usr balance error: ' + err)
        }
      })
      redisClient.hincrby('usr:' + account, 'purchaseNum', 1, function (err, reply) {
        if (reply) {
          console.log('get usr balance status: ' + reply)
        } else {
          console.log('get usr balance error: ' + err)
        }
      })
      redisClient.sadd('usr:' + account + ':purchase', trans, function (err, reply) {
        if (reply) {
          console.log('get usr balance status: ' + reply)
        } else {
          console.log('get usr balance error: ' + err)
        }
      })

      // change global variables
      redisClient.decr('global:poolNum', function (err, reply) {
        if (reply) {
          console.log('get usr balance status: ' + reply)
        } else {
          console.log('get usr balance error: ' + err)
        }
      })
      redisClient.srem('global:poolList', trans, function (err, reply) {
        if (reply) {
          console.log('get usr balance status: ' + reply)
        } else {
          console.log('get usr balance error: ' + err)
        }
      })
      redisClient.sadd('global:finishList', trans, function (err, reply) {
        if (reply) {
          console.log('get usr balance status: ' + reply)
        } else {
          console.log('get usr balance error: ' + err)
        }
      })
      // TODO write txInfo msg = 'succeed'
      // TODO write purchaseRes
    }
  })
  // TODO write purchaseRes
  redisClient.quit()
}

module.exports = function (req, res) {

}
