// tests/lib/basic/phantom-test.js

var config = require('../config').phantom;
var logger = require('../utils/logger');

var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;

var PhantomTest = module.exports = function(taskName, fullPath) {
  logger.debug('PhantomTest.ctor()');

  this.fullPath = fullPath;
  // TODO: путь к скриншотам
  this.taskName = taskName;
};

var runNpmStart = function() {
  var npmStart;
  var npmStartStopLine = config.npmStart.stopLine;
  var npmStartStartLine = config.npmStart.startLine;

  var runNpm = function(resolve, reject) {
    npmStart = spawn('npm', ['start' /*, 8080 */], { detached: true });

    npmStart.stdout.on('data', function(buffer) {
      var text = buffer.toString();

      if(npmStartStopLine && text.indexOf(npmStartStopLine) > -1) {
        logger.error('Could not start dev server');
        reject({
          result: 'FAILURE',
          reason: 'Could not start dev server'
        });
      } else if(text.indexOf(npmStartStartLine) > -1) {
        logger.info('Let\'s start phantomjs');
        resolve();
      }
    });

    npmStart.stderr.on('data', function(buffer) {
      var text = buffer.toString();

      if(text.indexOf('ADDRINUSE') > -1) {
        reject({
          result: 'FAILURE',
          reason: 'Address in use'
        });
      }
    });
  };

  logger.info('npm start');

  return new Promise(runNpm);
};

var runPhantomJS = function(fullPath) {
  var runPJ = function(resolve, reject) {
    var phantomJS = spawn(['phantomjs', fullPath]);

    var phantomStdout = '';

    phantomJS.stdout.on('data', function(buffer) {
      var text = buffer.toString();
      phantomStdout = phantomStdout + text;
      logger.debug(text);

      if(text.indexOf('in __webpack_require__') > -1) {
        process.kill(-npmStart.pid);
        phantomJS.kill();
      }
    });

    phantomJS.stderr.on('data', function(buffer) {
      var text = buffer.toString();
      logger.warn(text);
    });

    phantomJS.on('exit', function(code) {
      process.kill(-npmStart.pid);

      if(code > 0) {
        logger.error('PhantomJs could not work properly');
        reject({
          result: 'FAILURE',
          reason: 'PhantomJs could not work properly'
        });
      } else {
        logger.info('PhantomJS work completed');
        resolve(JSON.parse(phantomStdout));
      }
    });

    logger.info('phantomjs ' + fullPath);

    return new Promise(runPJ);
  };
};

var compareScreenshots = function(results) {
  // TODO: определиться с форматом принимаемых данных
  // TODO: реализовать (скопипастить/поменять) код для сравнения
  // TODO: сравнение двух файлов реализовано в предыдущей версии целиком
  // TODO: модифицировать results.tests[].{result,percent} в соответствии с результатами сравнения скриншотов
  // TODO: модифицировать results.result
};

var tp = PhantomTest.prototype;

tp.run = function() {
  var test = this;

  logger.debug('PhantomTest.run()');

  return (
    runNpmStart().
      then(function() {
        return runPhantomJS(test.fullPath);
      }).then(function(result) {
        if(result.result === 'PENDING') {
          return compareScreenshots(result);
        } else {
          return result;
        }
      })
  );
}
