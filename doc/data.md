# Data structure

###  Global

*usrNum*, *poolNum*, *txNum*, *blockHeight* and *powerUnit* come to be **String** type. *usrList*, *poolList*, *finishList*, *txList* are stored in **Set** type.

```json
{
    "global": {
        "usrNum": "",
        "poolNum": "",
        "txNum": "",
        "usrList": [],
        "poolList": [],
        "boardList": [],
        "finishList": [],
        "invalidList": [],
        "txList": [],
        "blockHeight": "",
        "powerUnit": ""
    }
}
```

### Account

Partial usrinfo associated with one account will be stored in **Hash** type, except for *deliveryList* and *purchaseList*, which shown in **Set** type. Corresponding keys about an account are `usr:$account`, `usr:$account:delivery` and `usr:$account:purchase` respectively.

```json
{
    "account": {
    	"account": "",
    	"password": "",
    	"balance": "",
        "storage": "",
        "sk": "(32bytes)",
        "pk": "(64bytes)",
    	"address": "(20bytes)",
    	"deliveryNum": "",
    	"purchaseNum": "",
        "invalidNum": "",
    	"deliveryList": [],
        "purchaseList": [],
        "demandList": [],
        "invalidList": []
    }
}
```

### Transaction

All txinfo associated with one transaction will be stored in **Hash** type. The key of tx is `tx:$txHash`.

```json
{
    "tx": {
        "txHash": "",
        "status": "waiting/succeeded/revoked",
        "blockHeight": "",
        "timestampSell": "",
        "timestampBuy": "",
        "timestampExpire": "",
        "power": "",
        "value": "",
        "amount": "",
        "type": "solar/water/wind",
        "from": "",
        "to": "",
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