/**
 *  log functions for debug
 */
const color = require('./color')
const fs = require('fs')

function date () {
  var time = new Date()
  return time.getFullYear().toString() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
}

function time () {
  var time = new Date()
  return date() + ' CST ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
}

function record (string) {
  var filename = date() + '-ServerLog'
  fs.writeFile('../../log/' + filename, string + '\n', {flag: 'a'}, function (err) {
    if (err) {
      return console.log(color.error(err))
    }
  })
}

exports.action = function (string) {
  var inputStr = time() + '\t' + string
  record(inputStr)
  console.log(color.action(inputStr))
}

exports.log = function (string) {
  var inputStr = time() + '\t' + string
  record(inputStr)
  console.log(color.log(inputStr))
}

exports.warn = function (string) {
  var inputStr = time() + '\t' + string
  record(inputStr)
  console.log(color.warn(inputStr))
}

exports.error = function (string) {
  var inputStr = time() + '\t' + string
  record(inputStr)
  console.log(color.error(inputStr))
}
