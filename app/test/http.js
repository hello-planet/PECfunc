/**
 * test for express req & res api
 */

module.exports = function (req, res) {
  var out = {}
  // node http module
  out['url'] = req.url
  // express api
  out['baseUrl'] = req.baseUrl
  out['originalUrl'] = req.originalUrl
  out['path'] = req.path
  out['hostname'] = req.hostname

  out['ip'] = req.ip
  out['ips'] = req.ips

  out['method'] = req.method
  out['protocol'] = req.protocol

  out['route'] = req.route

  out['Content-Type'] = req.get('Content-Type')

  // out['user_ip'] = getIp(req)
  res.send(out)
}

function getIp (req) {
  var ipStr = req.headers['x-forwarded-for'] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress || ''
  var ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
  if (ipStr.split(',').length > 0) {
    ipStr = ipStr.split(',')[0]
  }
  var ip = ipReg.exec(ipStr)
  return ip[0]
}