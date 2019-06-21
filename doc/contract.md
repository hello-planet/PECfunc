# Smart Contract API

### send()

```pseudocode
/*
 * Requires administrator privileges
 */
/* update the global variables */
function updatePoolSetting(
	uint _maxPower,
	uint _maxValue,
	uint _maxAmount,
	uint _powerUnit,
	uint _txTTL,
	uint _chargeFee )
event UpdatePool (
	uint maxPower,
	uint maxValue,
	uint maxAmount,
	uint powerUnit,
	uint txTTL,
	uint chargeFee )

/* draw the charge fee from contract to admin address */
function withdrawIncome()
event WithdrawIncome (uint addminBalance)

/* expire the tx */
function expireTx(bytes32 _txId)
event TxExpired (bytes32 txId)

/* remove the tx */
function removeTx(bytes32[] _txIds)
event TxDeleted (bytes32[] txIds)

/* add a new user account */
function newUser(address _usrAcc)
event NewUser(address usrAcc)

/* deposit to the user */
function deposit(address _usrAcc, uint _amount)
event Deposit(address usrAcc, uint amount)

/* withdraw from user account */
function withdraw(address _usrAcc, uint _amount)
event Withdraw(address usrAcc, uint amount)
event Broke(address usrAcc, uint amount)

/* load the commodity(electricity) to user account */
function load(address _usrAcc, uint _amount)
event Load(address usrAcc, uint amount)

/* unload the commodity(electricity) from user account */
function load(address _usrAcc, uint _amount)
event Unload(address usrAcc, uint amount)

/* verify the bid, transfer the tx to "winner",refund the other bidders */
function transfer(bytes32 _txId)
event TxSold (bytes32 txId)
```



```pseudocode
/*
 * User interfaces
 */
/* deliver a new tx */
function deliverTx(
	string _account,
	uint64 _timestampGen,
	uint64 _timestampExpire,
	uint8 _power, uint8 _value,
	uint8 _amount,
	string _powerType,
	string _inputData ) returns (bytes32 txId)
event NewTx (bytes32 txId)

/* purchase the tx */
function purchaseTx(bytes32 _txId)
event TxSold (bytes32 txId)

/* revoke the tx */
function revokeTx(bytes32 _txId)
event TxRevoked (bytes32 txId)

/* buyer bids for some unpurchased tx */
function bid(bytes32 _txId, uint8 _competePrice )
event NewBid (bytes32 _txId, address payable _bidder, uint8 _competePrice)

/* seller terminate the bid */
function terminateBid(bytes32 _txId)
event Terminate (bytes32 _txId)

/* seller guarantees the tx to buyer */
function approve(address payable _buyer, bytes32 _txId)
event Approve(bytes32 _txId)

/* buyer takes the guaranteed tx */
function takeOwnership(bytes32 _txId)
event TxSold (bytes32 txId)
```

### call()

```pseudocode
/* fetch the details of the tx */
function getTx(bytes32 _txId) returns (...)

/* fetch user's balance */
function balanceOf(address _usrAcc) returns (uint _balance)

/* fetch the tx's owner(buyer) */
function ownerOf(bytes32 _txId) returns (address _owner)
```
