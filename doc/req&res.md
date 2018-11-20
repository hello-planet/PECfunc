# Request & Response



### request

```json
{
    "request": {
        "signup": {
            "account": "",
            "password": ""
        },
        "login": {
            "account": "",
            "password": "",
            "time": ""
        },
        "account": {
            "sessionId": "",
            "msg": "accountInfo"
        },
        "pool": {
            "sessionId": "",
            "msg": "poolInfo"
        },
        "purchase": {
            "sessionID": "",
            "msg": "purchase",
            "timestampBuy": "",
            "tx": [
                {
                    "txhash": ""
                }
            ]
        },
        "delivery": {
            "sessionID": "",
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
            "msg": "passed/declined",
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
                    "blockhight": "",
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
                    "blockhight": "",
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
                    "blockhight": "",
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
                    "blockhight": "",
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
        }
    }
}
```



EOF