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
serv.defaultUsr()

// init pec-server
const app = express()
const usrApp = express.Router()
const txApp = express.Router()
const servApp = express.Router()

// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// app.set('trust proxy', true)
// app.set('trust proxy', '127.0.0.1/8')
app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1') return true
  else return false
})

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json')
  next()
})

// serve test pages(static files)
app.use('/demo', express.static(path.join(__dirname, '../wwwroot')))
// default page(unused)
app.get('/', serv.index)

// usr middleware funcitons
usrApp.post('/signup', require('./handler/signup'))
usrApp.post('/login', require('./handler/login'))
usrApp.get('/account/:msg/:sessionId', require('./handler/account'))
usrApp.delete('/logout', require('./handler/logout'))
usrApp.get('/alive/:msg/:sessionId', require('./handler/alive'))

// tx middleware functions
txApp.get('/pool/:msg/:sessionId', require('./handler/pool'))
txApp.put('/purchase', require('./handler/purchase'))
txApp.post('/delivery', require('./handler/delivery'))

// serv functions
servApp.get('/show', serv.show)
servApp.get('/test', serv.test)

// mount the respective routers on app
app.use('/usr', usrApp)
app.use('/tx', txApp)
app.use('/serv', servApp)

// handle the 404
// TODO fix route confusion and reuse
app.use(serv.notfound)

// function server port. appPORT used when 8080 is unavailable
const port = process.env.appPORT || 8080
const server = app.listen(port, function (err) {
  if (err) {
    logsys.error('server start-up error: ' + err)
  } else {
    logsys.seg('\n--------------------------SERVER STARTUP--------------------------')
    logsys.log('server started on ' + port)
  }
})

// health, readiness and liveness checks
const lightship = createLightship()
lightship.registerShutdownHandler(function () {
  server.close()
})
lightship.signalReady()
