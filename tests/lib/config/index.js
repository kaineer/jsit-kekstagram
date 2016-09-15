// tests/lib/config/index.js

var path = require('path');

module.exports = {
  log_level: process.env.LOG_LEVEL || 'INFO',
  tests_root: (
    process.env.TESTS_ROOT ||
    path.resolve(__dirname + '/../tasks')
  )
};
