# Data structure

###  Global

*usrNum*, *poolNum*, *txNum*, *blockHeight*, *nonce* and *powerUnit* come to be **String** type. *usrList*, *poolList*, *finishList*, *txList* are store in **Set** type.

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

Partial usrinfo associated with one account will be stored in **Hash** type, except for *deliveryList* and *purchaseList*, which shown in **Set** type. Corresponding keys about an account are `usr:$account`, `usr:$account:deliveryList` and `usr:$account:purchaseList` respectively.

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

All txinfo associated with one transaction will be stored in **Hash** type. The key of tx is `tx:$txHash`.

```json
{
    "tx": {
        "txHash": "",
        "status": "",
        "blockHeight": "",
        "timestampSell": "",
        "timestampBuy": "",
        "timestampExpire": "",
        "power": "",
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

All address-account pairs will be stored in **String** type. The key is `addr:$address`.

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

All sessionId-account pairs will be stored in **String** type. The key is `id:$sessionId`.

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