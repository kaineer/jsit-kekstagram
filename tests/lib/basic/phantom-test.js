// tests/lib/basic/phantom-test.js

var config = require('../config').phantom;
var logger = require('../utils/logger');

var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;

var path = require('path');

var PhantomTest = module.exports = function(fullPath, screenshotPath) {
  logger.debug('PhantomTest.ctor()');

  this.fullPath = fullPath;
  this.screenshotPath = screenshotPath;
};

PhantomTest.npmStart = function() {
  var npm = spawn('npm', ['start'], {detached: true});

  var npmStopLine = config.npmStart.stopLine;
  var npmStartLine = config.npmStart.startLine;

  var watchNpm = function(resolve, reject) {
    npm.stdout.on('data', function(buffer) {
      var text = buffer.toString();

      if(npmStopLine && text.indexOf(npmStopLine) > -1) {
        logger.error('Could not start dev server');
        resolve({
          result: 'FAILURE',
          reason: 'Could not start dev server',
          description: 'Не получается запустить девсервер. Попробуйте npm install и почитать package.json'
        });
      } else if(text.indexOf(npmStartLine) > -1) {
        resolve({
          result: 'SUCCESS'  // => Let's run phantom tests
        });
      }
    });

    npm.stderr.on('data', function(buffer) {
      var text = buffer.toString();

      if(text.indexOf('ADDRINUSE') > -1) {
        resolve({
          result: 'FAILURE',
          reason: 'Address in use',
          description: 'Возможно, запущен ещё один девсервер. Попробуйте его остановить и повторить тест'
        });
      }
    });
  };

  return {
    promise: new Promise(watchNpm),
    process: npm
  };
};

var runPhantomJS = function(fullPath) {
  var taskName = path.basename(path.dirname(fullPath));

  var wrapResult = function(result) {
    result.task = taskName;

    return result;
  };

  var runPJ = function(resolve, reject) {
    logger.debug('runPJ');

    var phantomJS = spawn('phantomjs', [fullPath]);

    var phantomStdout = '';

    phantomJS.stdout.on('data', function(buffer) {
      var text = buffer.toString();
      phantomStdout = phantomStdout + text;
      logger.debug(text);

      if(text.indexOf('in __webpack_require__') > -1) {
        phantomJS.kill();
      }
    });

    phantomJS.stderr.on('data', function(buffer) {
      var text = buffer.toString();
      logger.warn(text);
    });

    phantomJS.on('exit', function(code) {
      if(code > 0) {
        logger.error('PhantomJs could not work properly');
        resolve(wrapResult({
          result: 'FAILURE',
          reason: 'PhantomJs could not work properly'
        }));
      } else {
        logger.info('PhantomJS work completed');
        resolve(wrapResult(JSON.parse(phantomStdout)));
      }
    });
  };

  logger.info('phantomjs ' + fullPath);

  return new Promise(runPJ);
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

  return runPhantomJS(test.fullPath);

  // return (
  //   runNpmStart().
  //     then(function() {
  //       return runPhantomJS(test.fullPath);
  //     }).then(function(result) {
  //       if(result.result === 'PENDING') {
  //         return compareScreenshots(result);
  //       } else {
  //         return result;
  //       }
  //     });
  // );
};
