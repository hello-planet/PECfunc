# Service Interfaces

All CRUD operations conducted via RESTful HTTP requests.

## User

### signup

```json
{
    "request": {
        "_method": "POST",
        "_path": "/usr/signup",
        "account": "",
        "password": ""
    },
    "reponse": {
        "status": "",
        "msg": "",
        "text": "(Optional. password requirements)"
    }
}
```

### login

```json
{
    "request": {
        "_method": "POST",
        "_path": "/usr/login",
        "account": "",
        "password": ""
    },
    "reponse": {
        "status": "",
        "msg": "",
        "sessionId": "(Optional)"
    }
}
```

### account

```json
{
    "request": {
        "_method": "GET",
        "_path": "/usr/account/:sessionId"
    },
    "reponse": {
        "status": "",
        "msg": "",
        "sessionId": "",
        "account": "",
        "balance": "",
        "address": "",
        "deliveryNum": "",
        "purchaseNum": "",
        "revokeNum": "",
        "delivery": [
            {
                "txHash": "",
                "status": "waiting/succeeded",
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
        ],
        "purchase": [
            {
                "txHash": "",
                "status": "succeeded",
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
        ],
        "revoke": [
            {
                "txHash": "",
                "status": "revoked",
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
        ]
    }
}
```

### logout

```json
{
    "request": {
        "_method": "DELETE",
        "_path": "/usr/logout",
        "sessionId": 
    },
    "reponse": {
        "status": "",
        "msg": ""
    }
}
```

### alive

```json
{
    "request": {
        "_methond": "GET",
        "_path": "/usr/alive/:sessionId"
    },
    "reponse": {
        "status": "",
        "msg": "",
        "sessionId": ""
    }
}
```



## Tx

### pool

```json
{
    "request": {
        "_method": "GET",
        "_path": "/tx/pool/:sessionId"
    },
    "reponse": {
        "status": "",
        "msg": "",
        "sessionId": "",
        "tx": [
            {
                "txHash": "",
                "status": "waiting",
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
        ]
    }
}
```

### delivery

```json
{
    "request": {
        "_method": "POST",
        "_path": "/tx/delivery",
        "sessionId": "",
        "timestampSell": "",
        "tx": [
            {
                "timestampExpire": "",
                "power": "",
                "value": "",
                "amount": "",
                "type": "",
                "inputData": ""
            }
        ]
    },
    "reponse": {
        "status": "",
        "msg": "",
        "sessionId": "",
        "results": [
            {
                "txHash": "",
                "status": "waiting",
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
        ]
    }
}
```

### purchase

```json
{
    "request": {
        "_method": "PUT",
        "_path": "/tx/purchase",
        "sessionId": "",
        "timestampBuy": "",
        "tx": [
            {
                "txHash": ""
            }
        ]
    },
    "reponse": {
        "status": "",
        "msg": "",
        "sessionId": "",
        "results": [
            {
                "txHash": "",
                "result": "succeed/failed"
            }
        ]
    }
}
```

### revoke

```json
{
    "request": {
        "_method": "GET",
        "_path": "/tx/revoke/:sessionId/:txId"
    },
    "reponse": {
        "status": "",
        "msg": "",
        "sessionId": "",
        "txId": ""
    }
}
```

### available

```json
{
    "request": {
        "_methond": "GET",
        "_path": "/tx/available/:txId"
    },
    "reponse": {
        "status": "",
        "msg": "",
        "txId": ""
    }
}
```



## Service

### show

```json
{
    "request": {
        "_method": "GET",
        "_path": "/serv/show/:adminId"
    },
    "reponse": {
        "status": "",
        "msg": "",
        "usrNum": "",
        "poolNum": "",
        "txNum": "",
        "usrList": [],
        "poolList": [],
        "finishList": [],
        "txList": [],
        "revokeList": [],
        "blockHeight": "",
        "nonce": "",
        "powerUnit": ""
    }
}
```

EOF
