/**
 * usr operations
 */
const crypto = require('crypto')
const color = require('../utils/color')

var signupData = {
  account: 'bob',
  password: '123456'
}

exports.signup = function (req, res) {
  var existing = 0

  // check existence
  redisClient.exists('usr:' + signupData.account, function (err, reply) {
    if (reply) {
      console.log('usr exists status: ' + reply)
      // TODO to change the global variables
      this.existing = true
    } else {
      console.log('usr exists status: ' + err)
    }
  })

  if (existing) {
    //user already exists
    console.log('reponse: failed')
  } else {
    address = crypto.createHash('sha256').update(signupData.account + signupData.password).digest('hex')
    signupData.password = crypto.createHash('sha256').update(signupData.password).digest('hex')

    // write the usr and generate the response
    writeUser()
    changeGlobal()
    //Successfully signup
    console.log('response: successed')
  }

}

// exports.login = function () {
//
// }
//
// exports.account = function () {
//
// }
//
// exports.logout = function () {
//
// }

function writeUser () {
  redisClient.hmset('usr:' + signupData.account, [
      'account', signupData.account,
      'password', signupData.password,
      'balance', 100,
      'address', signupData.address,
      'deliveryNum', 0,
      'purchaseNum', 0],
    function (err, reply) {
      if (reply) {
        console.log('usr main list status: ' + reply)
      } else {
        console.log('usr main list error: ' + err)
      }
    })
  redisClient.sadd('usr:' + signupData.account + ':delivery', 'default', function (err, reply) {
    if (reply) {
      console.log('usr delivery list status: ' + reply)
    } else {
      console.log('usr delivery list error: ' + err)
    }
  })
  redisClient.sadd('usr:' + signupData.account + ':purchase', 'default', function (err, reply) {
    if (reply) {
      console.log('usr purchase list status: ' + reply)
    } else {
      console.log('usr purchase list error: ' + err)
    }
  })
  // set index from address to account
  redisClient.set('addr:' + signupData.address, signupData.account, function (err, reply) {
    if (reply) {
      console.log('address-account k-v status: ' + reply)
    } else {
      console.log('address-account k-v error: ' + err)
    }
  })
}

function changeGlobal () {
  redisClient.incr('global:usrNum', function (err, reply) {
    if (reply) {
      console.log('usr number increment status: ' + reply)
    } else {
      console.log('usr number increment error: ' + err)
    }
  })
  redisClient.sadd('global:usrList', signupData.account, function (err, reply) {
    if (reply) {
      console.log('usr added to global list status: ' + reply)
    } else {
      console.log('usr added to global list error: ' + err)
    }
  })
}
