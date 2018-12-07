/**
 * pec-server
 */
// express engine
const express = require('express')
const {
  createLightship
} = require('lightship')

// etc lib
const bodyParser = require('body-parser')
const proxyaddr = require('proxy-addr')
const path = require('path')
const logsys = require('./utils/log')

// handlers
const serv = require('./handler/serv')

// init redis client
serv.init()

// init pec-server
const app = express()
const usrApp = express.Router()
const txApp = express.Router()

// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// serve test pages(static files)
app.use('/demo', express.static(path.join(__dirname, '../wwwroot')))

// default page(unused)
app.get('/', serv.index)

// usr middleware funcitons
usrApp.post('/signup', require('./handler/signup'))
usrApp.post('/login', function (req, res) {res.send('login')})
usrApp.get('/account', function (req, res) {})
usrApp.delete('/logout', function (req, res) {})

// tx middleware functions
txApp.get('/pool', function (req, res) {})
txApp.put('/purchase', function (req, res) {})
txApp.post('/delivery', function (req, res) {})

// mount the respective routers on app
app.use('/usr', usrApp)
app.use('/tx', txApp)

// handle the 404
app.use(serv.notfound)

// function server port. appPORT used when 8080 is unavailable
const port = process.env.appPORT || 8080
const server = app.listen(port, function () {
  logsys.log('Server started on ' + port)
})

// health, readiness and liveness checks
const lightship = createLightship()
lightship.registerShutdownHandler(function () {
  server.close()
})
lightship.signalReady()
