/**
 * test pec-server
 */
const logsys = require('../utils/log')

// express engine
const express = require('express')
const bodyParser = require('body-parser')

// init server
const app = express()

app.get('/', function (req, res) {
  res.send('<h3 align="center">hello planet</h3>')
  logsys.log('root page visited')
})

// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// test
const test = require('./fake_hand')
const testApp = express.Router()
testApp.post('/usr/signup', test.signup)
testApp.post('/usr/login', test.login)
testApp.delete('/usr/logout', test.logout)
testApp.get('/usr/account', test.account)
testApp.get('/tx/pool', test.pool)
testApp.put('/tx/purchase', test.purchase)
testApp.post('/tx/delivery', test.delivery)
testApp.get('/show', test.show)

app.use('/test', testApp)

const port = 9090
app.listen(port, function () {
  logsys.log('Test server started on ' + port)
})
