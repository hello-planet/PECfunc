# Functions (deprecated)



### init

```pseudocode
INPUT
	// details in app/handler/serv.js
OUTPUT
```

### signup

```pseudocode
INPUT {account, password}
// test the account availablity
if redis.exists('usr:' + input.account)
	return msg = 'falied'
// set account variables
address = hash(input.account + input.password)
password = hash(input.password)
redis.hmset('usr:' + input.account, [
	'account', input.account, 
	'password', password, 
	'balance', 1000, 
	'address', address, 
	'deliveryNum', 0, 
	'purchaseNum', 0 ])
redis.sadd('usr:' + input.account + ":delivery", 'default')
redis.sadd('usr:' + input.account + ":purchase", 'default')
redis.set('addr:' + address, input.account)
// change the global variables
redis.incr(global:usrNum)
redis.sadd(global:usrList, input.account)
return msg = 'succeed'
OUTPUT {msg}
```

### login

```pseudocode
INPUT {account, password, time}
new json loginRes
if (redis.exists('usr:' + input.account)) 
	if (hash(input.password) == redis.hget('usr:' + input.account, 'password'))
		// set sessionId
		sessionId = hash(input.account | input.time)
		redis.set('id:' + sessionId, input.account)
		loginRes.write(msg = 'passed', sessionId)
else
	loginRes.write(msg = 'failed', sessionId = null)
return loginRes
OUTPUT loginRes
```

### account

```pseudocode
INPUT {sessionId, msg='accountInfo'}
if msg != 'accountInfo' | !redis.exists(input.sessionId)
	return null
account = redis.get(input.sessionId)
// main attributes 
new json usrInfo
usrInfo.write(input.sessionId)
usrInfo.write(redis.hgetall('usr:' + account))
// delivery list
new json deliveryInfo
for tx in redis.smembers('usr:' + account + ':delivery')
	deliveryInfo.write(redis.hget(tx))
usrInfo.write(deliveryInfo)
// purchase list
new json purchaseInfo
for tx in redis.smembers('usr:' + account + ':purchase')
	purchaseInfo.write(redis.hget(tx))
usrInfo.write(purchaseInfo)
return usrInfo
OUTPUT usrInfo
```

### pool

```pseudocode
INPUT {sessionId, msg='poolInfo'}
if msg != 'poolInfo' | !redis.exists(input.sessionId)
	return null
new json txList
for tx in redis.smembers('global:poolList')
	txList.write(redis.hgetall('tx:' + tx))
new json poolInfo
poolInfo.write(input.sessionId)
poolInfo.write(txList)
return poolInfo
OUTPUT poolInfo
```

### purchase

```pseudocode
INPUT {sessionId, msg='purchase', timestampBuy, tx[]}
if msg != 'purchase' | !redis.exists(input.sessionId)
	return null
new json purchaseRes
account = redis.get(input.sessionId)
fromAdd = redis.hget('usr:' + account, address)
for trans in input.tx[]  //trans = txHash
	txHash = 'tx:' + trans
	txValue = redis.hget(txHash, 'value')
	new json txInfo
	// determine balance sufficiency
	if (txValue > redis.hget('usr:' + account, 'balance'))
		txInfo.write(txHash, msg = 'failed, insufficient balance')
		continue
	// change the tx variables
	redis.hset(txHash, 'status', 'succeed')
	redis.hset(txHash, 'timestampBuy', input.timestampBuy)
	redis.hset(txHash, 'from', fromAdd)
	// change associated accounts' variables
	seller = redis.get('addr:' + redis.hget(txHash, 'to'))
	redis.hincrby('usr:' + seller, 'balance', txValue)
	redis.hincrby('usr:' + account, 'balance', -txValue)
	redis.hincrby('usr:' + account, 'purchaseNum', 1)
	redis.sadd('usr:' + account + ':purchase', trans )
	// change the global variables
	redis.decr(global:poolNum)
	redis.srem(global:poolList, trans)
	redis.sadd(global:finishList, trans)
	// write response json
	txInfo.write(txHash, msg = 'succeed')
	purchaseRes.write(txInfo)
purchaseRes.write(input.sessionId)
return purchaseRes
OUTPUT purchaseRes
```

### delivery

```pseudocode
INPUT {sessionId, msg='delivery', timestampSell, tx[]}
if msg != 'delivery' | !redis.exists(input.sessionId)
	return null
new json deliveryRes
account = redis.get(input.sessionId)
toAdd = redis.hget('usr:' + account, 'address')
powerUnit = redis.get('global:powerUnit')
blockHeight = redis.get('global:blockHeight')
nonce = redis.get('global:nonce')
for trans in input.tx[]  //trans = {value, amount, type, inputDate}
	txHash = hash(acount + time.Now)  //generate the current time
	// set tx hash
	redis.hmset('tx:' + txHash, [
		'txHash', txHash,=
		'status', 'waiting', 
		'blockHeight', blockHeight,
		'timestampSell', input.timestampSell, 
		'timestampBuy', '', 
		'value', trans.value,
		'amount', trans.amount, 
		'type', trans.type, 
		'from', '', 
		'to', toAdd, 
		'nonce', nonce, 
		'inputData', trans.inputData])
	if (trans.value == 0)
		redis.hset('tx:' + txHash, 'value', trans.amount * powerUnit)
	// change associated accounts' variables
	redis.hincrby('usr:' + account, deliveryNum, 1)
	redis.sadd('usr:' + account + ':delivery', txHash )
	// change the global variables
	redis.incr(global:txNum)
	redis.incr(global:poolNum)
	redis.sadd(global:txList, txHash)
	redis.sadd(global:poolList, txHash)
	// write response json
	new json txInfo
	txInfo.write(redis.hgetall('tx:' + txHash))
	txInfo.write(msg = 'succeed')
	deliveryRes.write(txInfo)
deliveryRes.write(input.sessionId)
return deliveryRes
OUTPUT deliveryRes
```

### logout

```pseudocode
INPUT
	// details in app/handler/logout.js
OUTPUT
```

