# Request & Response

All CRUD operations conducted via RESTful HTTP requests.

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
            "_path": "/usr/account/:sessionId"
        },
        "pool": {
            "_method": "GET",
            "_path": "/tx/pool/:sessionId"
        },
        "purchase": {
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
        "delivery": {
            "_method": "POST",
            "_path": "/tx/delivery",
            "sessionId": "",
            "timestampSell": "",
            "tx": [
                {
                    "value": "",
                    "amount": "",
                    "type": "",
                    "inputData": ""
                }
            ]
        },
        "logout": {
            "_method": "DELETE",
            "_path": "/usr/logout",
            "sessionId": ""
        },
        "alive": {
            "_methond": "GET",
            "_path": "/usr/alive/:sessionId"
    	},
        "available": {
            "_methond": "GET",
            "_path": "/tx/available/:txId"
    	},
        "show": {
            "_method": "GET",
            "_path": "/serv/show/:adminId"
        }
    }
}
```

### response

All msg fields will be shown for debugging and deleted in production enviroment.

```json
{
    "response": {
        "signup": {
            "status": "",
            "msg": "",
            "text": "(Optional. password requirements)"
        },
        "login": {
            "status": "",
            "msg": "",
            "sessionId": "(Optional)"
        },
        "account": {
            "status": "",
            "msg": "",
            "sessionId": "",
            "account": "",
            "balance": "",
            "address": "",
            "deliveryNum": "",
            "purchaseNum": "",
            "delivery": [
                {
                    "txHash": "",
                    "status": "waiting/succeed",
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
                    "type": "",
                    "from": "",
                    "to": "",
                    "nonce": "",
                    "inputData": ""
                }
            ]
        },
        "pool": {
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
                    "value": "",
                    "amount": "",
                    "type": "",
                    "from": "",
                    "to": "",
                    "nonce": "",
                    "inputData": ""
                }
            ]
        },
        "purchase": {
            "status": "",
            "msg": "",
            "sessionId": "",
            "results": [
                {
                    "txHash": "",
                    "result": "succeed/failed"
                }
            ]
        },
        "delivery": {
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
                    "value": "",
                    "amount": "",
                    "type": "",
                    "from": "",
                    "to": "",
                    "nonce": "",
                    "inputData": "",
                    "result": "succeed/failed"
                }
            ]
        },
        "logout": {
            "status": "",
            "msg": ""
        },
        "alive": {
            "status": "",
            "msg": "",
            "sessionId": ""
    	},
        "available": {
            "status": "",
            "msg": "",
            "txId": ""
    	},
        "show": {
            "status": "",
            "msg": "",
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
}
```


EOF