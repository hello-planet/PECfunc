/**
 * global variables and server setting
 */
module.exports = {
  redis: {
    host: '',
    // host: '127.0.0.1',
    port: '6379'
  },
  globalVar: {
    usrNum: 0,
    poolNum: 0,
    txNum: 0,
    blockHeight: 1,
    powerUnit: 0.5
  },
  password: {
    strong: {
      pattern: /^.*(?=.{8,16})(?=.*\d)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[!@#$%^&*?\(\)]).*$/,
      description: '8-16 bits characters. At least one number, one lowercase, one capital letter and one special characters.'
    },
    moderate: {
      pattern: /^.*(?=.{6,16})(?=.*\d*)(?=.*[a-zA-Z]+)(?=.*[!@#$%^&*?\(\)]*).*$/,
      description: '6-16 bits with numbers and lowercases. Optional capital letters and special characters.'
    },
    weak: {
      pattern: /^[\w!@#$%^&*?\(\)]{3,16}$/,
      description: '3-16 bits with any alphanumeric characters. Excluding special characters.'
    },
    worstOfHistory: {
      pattern: 123456,
      description: 'Come on! you call this a password?'
    }
  },
  status: {
    success: {
      711: 'Service in progress.',
      712: 'Database connected successfully.',
      713: 'Global data fetched.',
      714: 'Global data persisted into disk.',
      721: 'User Signed up successfully.',
      722: 'User logged in successfully.',
      723: 'User account information fetched.',
      724: 'User logged out.',
      725: 'User still alive.',
      731: 'Transaction pool information fetched.',
      732: 'Transactions purchased successfully.',
      733: 'Transactions deliveried successfully.',
      734: 'Transaction still valid.',
      735: 'Transaction revoked successfully.'
    },
    illegal: {
      811: 'Invalid session ID for fetching global data.',
      812: 'Global data persistence failed.',
      821: 'Account name has already been in use.',
      822: 'Password not strong enough.',
      823: 'Account name does not exist.',
      824: 'Incorrect password.',
      825: 'Illegal session ID for account info.',
      826: 'User dead or illegal session ID.',
      827: 'Illegal session ID for log out.',
      831: 'Illegal session ID for pool info.',
      832: 'Illegal session ID for purchase.',
      833: 'Transaction not available.',
      834: 'Illegal session ID for delivery.',
      835: 'Transaction purchased.',
      836: 'Transaction undefined.',
      837: 'Illegal session ID for revoke.',
      838: 'Transaction not found in user\'s tx list.',
      839: 'Transaction to be revoked has been purchased.'
    },
    error: {
      911: 'Server port already been in use.',
      912: 'Database connection failed.'
    }
  },
  admin: {
    password: 'admin'
  },
  transaction: {
    status: ['waiting', 'succeeded', 'revoked'],
    type: ['solar', 'water', 'wind']
  },
  testUsr: {
    alice: '123456',
    bob: '123456',
    carl: '123456'
  }
}