# Request & Response

All CRUD operations conducted via RESTful(alike) HTTP requests.

### request

```json
{
    "request": {
        "signup": {
            "_method": "POST",
            "_path": "/usr/signup",
            "account": "",
            "password": ""
        },
        "login": {
            "_method": "POST",
            "_path": "/usr/login",
            "account": "",
            "password": ""
        },
        "account": {
            "_method": "GET",
            "_path": "/usr/account",
            "sessionId": "",
            "msg": "accountInfo"
        },
        "pool": {
            "_method": "GET",
            "_path": "/tx/pool",
            "sessionId": "",
            "msg": "poolInfo"
        },
        "purchase": {
            "_method": "PUT",
            "_path": "/tx/purchase",
            "sessionId": "",
            "msg": "purchase",
            "timestampBuy": "",
            "tx": [
                {
                    "txHash": ""
                }
            ]
        },
        "delivery": {
            "_method": "POST",
            "_path": "/tx/delivery",
            "sessionId": "",
            "msg": "delivery",
            "timestampSell": "",
            "tx": [
                {
                    "value": "",
                    "amount": "",
                    "type": "wind/light/water",
                    "inputData": ""
                }
            ]
        },
        "logout": {
            "_method": "DELETE",
            "_path": "/usr/logout",
            "sessionId": "",
            "msg": "logout"
        }
    }
}
```

### response

```json
{
    "response": {
        "signup": {
            "msg": ""
        },
        "login": {
            "msg": "passed/failed",
            "sessionId": ""
        },
        "account": {
            "sessionId": "",
            "account": "",
            "balance": "",
            "address": "",
            "delivery": [
                {
                    "txHash": "",
                    "status": "waiting/succeed",
                    "blockHeight": "",
                    "timestampSell": "",
                    "timestampBuy": "",
                    "value": "",
                    "amount": "",
                    "type": "wind/light/water",
                    "from": "",
                    "to": "",
                    "nonce": "",
                    "inputData": ""
                }
            ],
            "purchase": [
                {
                    "txHash": "",
                    "status": "succeed",
                    "blockHeight": "",
                    "timestampSell": "",
                    "timestampBuy": "",
                    "value": "",
                    "amount": "",
                    "type": "wind/light/water",
                    "from": "",
                    "to": "",
                    "nonce": "",
                    "inputData": ""
                }
            ],
            "deliveryNum": "",
            "purchaseNum": ""
        },
        "pool": {
            "sessionId": "",
            "tx": [
                {
                    "txHash": "",
                    "status": "waiting",
                    "blockHeight": "",
                    "timestampSell": "",
                    "timestampBuy": "",
                    "value": "",
                    "amount": "",
                    "type": "wind/light/water",
                    "from": "",
                    "to": "",
                    "nonce": "",
                    "inputData": ""
                }
            ]
        },
        "purchase": {
            "sessionId": "",
            "result": [
                {
                    "txHash": "",
                    "msg": "succeed/failed"
                }
            ]
        },
        "delivery": {
            "sessionId": "",
            "result": [
                {
                    "txHash": "",
                    "status": "waiting",
                    "blockHeight": "",
                    "timestampSell": "",
                    "timestampBuy": "",
                    "value": "",
                    "amount": "",
                    "type": "wind/light/water",
                    "from": "",
                    "to": "",
                    "nonce": "",
                    "inputData": "",
                    "msg": "succeed/failed"
                }
            ]
        },
        "logout": {
            "msg": ""
        }
    }
}
```



EOF