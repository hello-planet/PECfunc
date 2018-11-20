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
        "powerUnit": ""
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
    	"purchaseList": []
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
        "inputData": ""
    }
}
```

### K-V address-account

```json
{
    "address-account": [
        {
            "address": "",
            "account": ""
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
            "account": ""
        }
    ]
}
```

 

EOF