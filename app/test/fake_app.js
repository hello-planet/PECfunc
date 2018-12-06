/**
 * test pec-server
 */

// express engine
const express = require('express')
const bodyParser = require('body-parser')
const color = require('../utils/color')

// init server
const app = express()

// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// test
const test = require('./test')
const testApp = express.Router()
testApp.post('/signup', test.signup)
testApp.post('/login', test.login)
testApp.delete('/logout', test.logout)
testApp.get('/account', test.account)
testApp.get('/pool', test.pool)
testApp.put('/purchase', test.purchase)
testApp.post('/delivery', test.delivery)
testApp.get('/show',test.show)

app.use('/test', testApp)

const port = 9090
app.listen(port, function () {
  console.log(color.log('Test server started on ' + port))
})