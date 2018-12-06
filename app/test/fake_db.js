/**
 * fake database
 */
module.exports = {
  global: {
    'usrNum': 2,
    'poolNum': 2,
    'txNum': 2,
    'usrList': ['alice', 'bob'],
    'poolList': ['alice1', 'bob1'],
    'finishList': [],
    'txList': ['alice1', 'bob1'],
    'blockHeight': 10,
    'nonce': '1117',
    'powerUnit': 0.5
  },
  usr: {
    'alice': {
      'account': 'alice',
      'password': '123456',
      'balance': 100,
      'address': 'alice_addr',
      'deliveryNum': 1,
      'purchaseNum': 0,
      'deliveryList': ['alice1'],
      'purchaseList': [],
    },
    'bob': {
      'account': 'bob',
      'password': '654321',
      'balance': 100,
      'address': 'bob_addr',
      'deliveryNum': 1,
      'purchaseNum': 0,
      'deliveryList': ['bob1'],
      'purchaseList': [],
    }
  },
  tx: {
    'alice1': {
      'txHash': 'alice1',
      'status': 'waiting',
      'blockHeight': 10,
      'timestampSell': '20181130',
      'timestampBuy': '',
      'value': 50,
      'amount': '',
      'type': 'wind',
      'from': '',
      'to': 'alice_addr',
      'nonce': '1117',
      'inputData': 'sell from alice'
    },
    'bob1': {
      'txHash': 'bob1',
      'status': 'waiting',
      'blockHeight': 10,
      'timestampSell': '20181130',
      'timestampBuy': '',
      'value': 50,
      'amount': '',
      'type': 'light',
      'from': '',
      'to': 'bob_addr',
      'nonce': '1117',
      'inputData': 'sell from bob'
    }
  },
  add2acc: {
    'alice_addr': 'alice',
    'bob_addr': 'bob'
  },
  id2acc: {
    'alice_id': 'alice'
  }
}
