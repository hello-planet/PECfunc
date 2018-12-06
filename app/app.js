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
const color = require('./utils/color')

// redis lib
const redis = require('redis')
const config = require('./config/config')

// handlers
const serv = require('./handler/serv')
const usr = require('./handler/usr')
const tx = require('./handler/tx')

// init redis client
const redisClient = redis.createClient(config.redis)
redisClient.on('error', function (err) {
  console.log(color.error('Error: ' + err))
})
redisClient.on('connect', function () {
  console.log(color.log('Connected to Redis successfully.'))
})
serv.init(redisClient)

// init server
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
usrApp.post('/signup', function (req, res) {})
usrApp.post('/login', function (req, res) {})
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
  console.log(color.log('Server started on ' + port))
})

// health, readiness and liveness checks
const lightship = createLightship()
lightship.registerShutdownHandler(function () {
  server.close()
})
lightship.signalReady()
