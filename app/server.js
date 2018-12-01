/**
 *  PECfunc server
 */
const express = require('express')
const exphbs = require('express-handlebars')
const redis = require('redis')

// init redis client
let redisClient = redis.createClient()
redisClient.on('connect', function () {
  console.log('Connected to Redis...')
})

// function server port
const port = 8080

// init server
const app = express()

// static files for interfaces test
app.use('/test', express.static('../wwwroot'))

// root page
app.get('/', function (req, res, next) {
  res.send('function server engine started')
})

// test page
app.post('/login', function (req, res, next) {
  res.send('login test')
})

app.listen(port, function () {
  console.log('server started listening on ' + port)
})

module.exports = app
