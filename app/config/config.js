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
    nonce: '1117',
    powerUnit: 0.5
  },
  password: {
    demand_pattern: /^[\w_-]{6,16}$/
  },
  status: {
    success: {
      711: 'Service in progress.',
      712: 'Database connected.',
      713: 'Global data fetched.',
      714: 'Global data persisted into disk.',
      721: 'User Signed up.',
      722: 'User logged in.',
      723: 'User account information fetched.',
      724: 'User logged out.',
      725: 'User still alive (for heartbeat query).',
      731: 'Transaction pool information fetched.',
      732: 'Transaction purchased.',
      733: 'Transaction deliveried.',
      734: 'Transaction still valid (for tx verification).'
    },
    illegal: {
      811: 'Invalid session ID (for fetching global data).',
      812: 'Global data persistence failed.',
      821: 'Account name already been in use.',
      822: 'Password not strong enough.',
      823: 'Account name does not exist.',
      824: 'Incorrect password.',
      825: 'Illegal session ID (for account info).',
      826: 'User dead (for heartbeat query).',
      827: 'Illegal session ID (for log out).',
      831: 'Illegal session ID (for pool info).',
      832: 'Illegal session ID (for purchase).',
      833: 'Transaction not available (for transaction validity query).',
      834: 'Illegal session ID (for delivery).',
      835: 'Transaction purchased (for tx verification).',
      836: 'Transaction undefined (for tx verification)'
    },
    error: {
      911: 'Server port already been in use.',
      912: 'Database connection failed.'
    }
  }
}