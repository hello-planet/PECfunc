/**
 * password strength testment
 *
 */
const pwDemand = require('../config/config').password
var password = [
  12345678,
  '12345678Z',
  '12345678z',
  '12345678Zz',
  'sadsadSA',
  'du42DUa!',
  'iFaaaaat3#'
]
console.log('PASSWORD\t\tSTRONG\t\tMODERATE\tWEAK')
for (let item of password) {
  console.log(item + '\t\t' + pwDemand.strong.pattern.test(item) + '\t\t' + pwDemand.moderate.pattern.test(item) + '\t\t' + pwDemand.weak.pattern.test(item))
}
