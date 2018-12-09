/**
 *  log functions for debug
 */
const color = require('./color')
const fs = require('fs')
const path = require('path')

function date () {
  var time = new Date()
  return time.getFullYear().toString() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
}

function time () {
  var time = new Date()
  return date() + ' CST ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
}

function record (string) {
  var filename = date() + '-Server.log'
  fs.writeFile(path.join(__dirname, '../../log/') + filename, string + '\n', {flag: 'a'}, function (err) {
    if (err) {
      return console.log(color.error(err))
    }
  })
}

exports.action = function (string) {
  var inputStr = time() + '\t' + 'ACT:\t' + string
  record(inputStr)
  console.log(color.action(inputStr))
}

exports.log = function (string) {
  var inputStr = time() + '\t' + 'LOG:\t' + string
  record(inputStr)
  console.log(color.log(inputStr))
}

exports.warn = function (string) {
  var inputStr = time() + '\t' + 'WARN:\t' + string
  record(inputStr)
  console.log(color.warn(inputStr))
}

exports.error = function (string) {
  var inputStr = time() + '\t' + 'ERR:\t' + string
  record(inputStr)
  console.log(color.error(inputStr))
}

exports.seg = function (string) {
  record(string)
  console.log(color.seg(string))
}
