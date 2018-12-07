const redis = require('redis')
const bluebird = require('bluebird')
const redisClient = redis.createClient()

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

async function async () {

  await redisClient.onAsync('connect').then(function (reply) {
    console.log('successfully connected')
  })

  console.log('this is start')
  await redisClient.setAsync('a', '123').then(function (res) {
    console.log(res)
  })

  await redisClient.getAsync('a').then(function (res) {
    console.log(res)
  })
  console.log('this is end')
  redisClient.quit()
}

async()
