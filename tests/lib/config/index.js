// tests/lib/config/index.js

var env;

try {
  env = process.env;
} catch(err) {
  var system = require('system');
  env = system.env;
}

module.exports = {
  log_level: env.LOG_LEVEL || 'INFO',
  tests_root: (
    env.TESTS_ROOT || './tests/lib/tasks'
  ),
  screenshots_root: (
    './tests/screenhots'
  ),
  phantom: {
    log: {
      tail_size: 20,
    },
    url: 'http://localhost:1507',
    page: {
      width: 1024,
      height: 800
    },
    shims: './tests/lib/humgat/shims.js',

    npmStart: {
      startLine: 'Сервер запущен на порту'
    }
  }
};
