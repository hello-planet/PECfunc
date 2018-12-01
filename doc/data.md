# Data structure

###  Global

```json
{
    "global": {
        "usrNum": "",
        "poolNum": "",
        "txNum": "",
        "usrList": [],
        "poolList": [],
        "finishList": [],
        "txList": [],
        "blockHeight": "",
        "nonce": "",
        "powerUnit": "",
        "_comment": "In redis server, usrNum, poolNum, txNum, blockHeight, nonce and powerUnit come to be 'String' type, while usrList, poolList, finishList, txList are store in 'Set' type."
    }
}
```

### Account

```json
{
    "account": {
    	"account": "",
    	"password": "",
    	"balance": "",
    	"address": "",
    	"deliveryNum": "",
    	"purchaseNum": "",
    	"deliveryList": [],
        "purchaseList": [],
        "_comment": "In redis server, partial usrinfo associated with one account will be stored in 'Hash' type, except for deliveryList and purchaseList, which shown in 'Set' type. Corresponding keys about an account are 'usr:$account', 'usr:$account:deliveryList' and 'usr:$account:purchaseList' respectively."
    }
}
```

### Transaction

```json
{
    "tx": {
        "txHash": "",
        "status": "",
        "blockHeight": "",
        "timestampSell": "",
        "timestampBuy": "",
        "value": "",
        "amount": "",
        "type": "",
        "from": "",
        "to": "",
        "nonce": "",
        "inputData": "",
        "_comment": "In redis server, all txinfo associated with one transaction will be stored in 'Hash' type. The key of tx is 'tx:$txHash'."
    }
}
```

### K-V address-account

```json
{
    "address-account": [
        {
            "address": "",
            "account": "",
            "_comment": "In redis server, all address-account pairs will be stored in 'String' type. The key is 'addr:$address'."
        }
    ]
}
```

### K-V sessionId-account

```json
{
    "sessionId-account": [
        {
            "sessionId": "",
            "account": "",
            "_comment": "In redis server, all sessionId-account pairs will be stored in 'String' type. The key is 'id:$sessionId'."
        }
    ]
}
```

 

EOF