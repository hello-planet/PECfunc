/**
 * test functions
 */
var fakeDB = require('./fake_db')
const logsys = require('../utils/log')

exports.signup = function (req, res) {
  var out = {
    'msg': 'failed'
  }
  if (!(req.body.account === undefined || fakeDB.usr.hasOwnProperty(req.body.account))) {
    fakeDB.usr[req.body.account] = {
      'account': req.body.account,
      'password': req.body.password,
      'balance': '100',
      'address': req.body.account + '_addr',
      'deliveryNum': 0,
      'purchaseNum': 0,
      'deliveryList': [],
      'purchaseList': []
    }
    fakeDB.add2acc[req.body.account + '_addr'] = req.body.account
    // global variables
    fakeDB.global.usrNum += 1
    fakeDB.global.usrList.push(req.body.account)
    out.msg = 'succeed'
    logsys.action(req.body.account + ' signed up')
  }
  // console.log(fakeDB.global.usrList)
  res.send(out)
}

exports.login = function (req, res) {
  var out = {
    'msg': 'declined'
  }
  var flag = fakeDB.usr.hasOwnProperty(req.body.account) && req.body.password === fakeDB.usr[req.body.account].password
  if (flag) {
    out.msg = 'passed'
    out['sessionId'] = req.body.account + '_id'
    fakeDB.id2acc[req.body.account + '_id'] = req.body.account
    logsys.action(req.body.account + ' logged in from')
  }
  // console.log(fakeDB.id2acc)
  res.send(out)
}

exports.logout = function (req, res) {
  var out = {
    'msg': 'failed'
  }
  if (fakeDB.id2acc.hasOwnProperty(req.body.sessionId) && req.body.msg === 'logout') {
    logsys.action(fakeDB.id2acc[req.body.sessionId] + ' logged out')
    delete fakeDB.id2acc[req.body.sessionId]
    out.msg = 'you\'ve log out'
  }
  // console.log(fakeDB.id2acc)
  res.send(out)
}

exports.account = function (req, res) {
  var out = {
    'msg': 'failed'
  }
  var flag = fakeDB.id2acc.hasOwnProperty(req.body.sessionId) && req.body.msg === 'accountInfo'
  if (flag) {
    temp = fakeDB.usr[fakeDB.id2acc[req.body.sessionId]]
    out = {}
    out['sessionId'] = req.body.sessionId
    out['account'] = temp.account
    out['balance'] = temp.balance
    out['address'] = temp.address
    out['deliveryNum'] = temp.deliveryNum
    out['purchaseNum'] = temp.purchaseNum
    out['delivery'] = []
    out['purchase'] = []
    for (let item of temp.deliveryList) {
      out['delivery'].push(fakeDB.tx[item])
    }
    for (let item of temp.purchaseList) {
      out['purchase'].push(fakeDB.tx[item])
    }
    logsys.action(fakeDB.id2acc[req.body.sessionId] + ' requested for account info')
  }
  res.send(out)
}

exports.delivery = function (req, res) {
  var out = {
    'sessionId': '',
    'result': []
  }
  var flag = fakeDB.id2acc.hasOwnProperty(req.body.sessionId) && req.body.msg === 'delivery'
  if (flag) {
    var seller = fakeDB.id2acc[req.body.sessionId]
    out.sessionId = req.body.sessionId
    for (let item of req.body.tx) {
      var oneTx = {}
      oneTx['txHash'] = seller + (fakeDB.usr[seller].deliveryNum + 1).toString()
      oneTx['status'] = 'waiting'
      oneTx['blockheight'] = fakeDB.global.blockHeight
      oneTx['timestampsell'] = req.body.timestampSell
      oneTx['timestampbuy'] = ''
      oneTx['value'] = item.value
      oneTx['amount'] = item.amount
      oneTx['type'] = item.type
      oneTx['from'] = ''
      oneTx['to'] = fakeDB.usr[seller].address
      oneTx['nonce'] = fakeDB.global.nonce
      oneTx['inputData'] = item.inputData
      if (item.value === 0) {
        oneTx['value'] = item.amount * fakeDB.global.powerUnit
      }
      // tx
      fakeDB.tx[oneTx.txHash] = oneTx
      // usr
      fakeDB.usr[seller].deliveryNum += 1
      fakeDB.usr[seller].deliveryList.push(oneTx.txHash)
      // global
      fakeDB.global.txNum += 1
      fakeDB.global.poolNum += 1
      fakeDB.global.txList.push(oneTx.txHash)
      fakeDB.global.poolList.push(oneTx.txHash)
      out.result.push(oneTx)
    }
    var logMsg = fakeDB.id2acc[req.body.sessionId] + ' delivered ' + req.body.tx.length + ' transactions'
    logsys.action(logMsg)
  }
  res.send(out)
}

exports.pool = function (req, res) {
  var out = {
    'sessionId': '',
    'tx': []
  }
  var flag = fakeDB.id2acc.hasOwnProperty(req.body.sessionId) && req.body.msg === 'poolInfo'
  if (flag) {
    out.sessionId = req.body.sessionId
    for (let item of fakeDB.global.poolList) {
      out.tx.push(fakeDB.tx[item])
    }
    logsys.action(fakeDB.id2acc[req.body.sessionId] + ' requested for pool info')
  }
  res.send(out)
}

exports.purchase = function (req, res) {
  var out = {
    'sessionId': '',
    'result': []
  }
  var flag = fakeDB.id2acc.hasOwnProperty(req.body.sessionId) && req.body.msg === 'purchase'
  if (flag) {
    var buyer = fakeDB.id2acc[req.body.sessionId]
    out.sessionId = req.body.sessionId
    for (let item of req.body.tx) {
      var oneTx = {}
      oneTx['txhash'] = item.txhash
      if (fakeDB.usr[buyer].balance < fakeDB.tx[oneTx.txhash].value) {
        oneTx['msg'] = 'failed'
        out.result.push(oneTx)
        continue
      }
      // tx
      fakeDB.tx[oneTx.txhash].status = 'succeed'
      fakeDB.tx[oneTx.txhash].timestampbuy = req.body.timestampBuy
      fakeDB.tx[oneTx.txhash].from = fakeDB.usr[buyer].address
      // usr
      fakeDB.usr[buyer].balance -= fakeDB.tx[oneTx.txhash].value
      fakeDB.usr[buyer].purchaseNum += 1
      fakeDB.usr[buyer].purchaseList.push(oneTx.txhash)
      var seller = fakeDB.add2acc[fakeDB.tx[oneTx.txhash].to]
      fakeDB.usr[seller].balance += fakeDB.tx[oneTx.txhash].value
      // global
      fakeDB.global.poolNum -= 1
      fakeDB.global.poolList.splice(fakeDB.global.poolList.indexOf(oneTx.txhash), 1)
      fakeDB.global.finishList.push(oneTx.txhash)
      oneTx['msg'] = 'succeed'
      out.result.push(oneTx)
    }
    var logMsg = fakeDB.id2acc[req.body.sessionId] + ' purchased ' + req.body.tx.length + ' transactions'
    logsys.action(logMsg)
  }
  res.send(out)
}

exports.show = function (req, res) {
  res.send(fakeDB)
}
