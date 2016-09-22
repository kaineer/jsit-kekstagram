// tests/lib/basic/suite.js

// Выделяем номер задания
// Выполняем все доступные в файловой системе тесты
//   у которых либо номер модуля меньше текущего
//   либо номер модуля тот же, а номер таска - меньше или равен

// Файлы раскладываем следующим образом
// tests/lib/
//          /moduleX-taskY/node-test.js // -- тест выполняется в node
//                        /phantomjs-test.js // -- тест выполняется в phantomjs-test

var parseBranchName = require('../utils/parameters').parseBranchName;
var logger = require('../utils/logger');
var config = require('../config');
var path = require('path');
var glob = require('glob');

var PhantomTest = require('./phantom-test');

var Suite = module.exports = function(branchName) {
  var branch = parseBranchName(branchName);

  this.module = branch.module;
  this.task = branch.task;
};

var sp = Suite.prototype;

/**
 * @return {Promise} promise it resolves if all tests are ok
 *                           it rejects if some tests are failed
 */
sp.run = function() {
  // logger.debug('TEST_ROOT=' + path.resolve(config.tests_root));
  // 1. Определить корень папок с тестовыми скриптами
  // 2. Отобрать только те, что подходят по критериям
  // 3. Выполнить отобранные
  //    phantom- тесты возвращают результат через stdout
  //    node- тесты возвращают результат как значение
  // 4. Отобразить результаты, как строку разноцветных точек
  // 5. Отобразить ошибки, если есть
  // 6. Выйти с кодом 1, если есть ошибки

  var nodeTestFolders = this._getTestFolders('node-');
  var phantomTestFolders = this._getTestFolders('phantom-');

  logger.debug('Suite.run()');

  var nodeTestsPromise = this._getNodeTestsInFolders(nodeTestFolders);
  // var phantomTestsPromise = this._getPhantomTestsInFolders(phantomTestFolders);

  nodeTestsPromise.then(function(result) {
    logger.debug('\n' + JSON.stringify(result, null, 2));
  });

  // TODO: fix this
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve()
    }, 200);
  });

  // TODO: to be continued
  //
  // this._logResults();
  //
  // return this.ok;
};

sp._getTestFolders = function(prefix) {
  var testsRoot = path.resolve(config.tests_root);
  var paths = glob.sync(testsRoot + '/module*-task*');
  var suite = this;

  return (
    paths.filter(function(fullPath) {
      var taskName = path.basename(fullPath);
      var branchInfo = parseBranchName(taskName);

      // === search for prefixed tests (when prefix is specified) ===
      var tests;

      if(typeof(prefix) === 'string') {
        tests = glob.sync(path.join(fullPath, prefix + '*.js'));

        if(tests.length === 0) {
          return false;
        }
      }

      // === cases ===
      // this: { 3, 2 }
      //   bi: { 3, 2 } => true
      //   bi: { 2, * } => true
      //   bi: { 4, * } => true
      //   bi: { 3, 3 } => false
      //   bi: { 3, 1 } => false

      return (
        branchInfo.module < this.module ||
        (
          branchInfo.module === this.module &&
          branchInfo.task <= this.task
        )
      );
    }, this)
  );
};

sp._getNodeTestsInFolders = function(folders) {
  var promises = folders.map(function(folder) {
    return this._getNodeTestIn(folder);
  }, this);

  return Promise.all(promises);
};

sp._getPhantomTestsInFolders = function(folders) {
  // TODO: remove this when node tests are implemented
  return [];

  var promises = folders.map(function(folder) {
    return new Promise(this._getPhantomtestIn(folder));
  }, this);

  return Promise.all(promises);
};

sp._getNodeTestIn = function(folder) {
  var testPath = glob.sync(path.join(folder, 'node-*.js'))[0];
  var test = require(testPath);

  return new Promise(function(resolve) {
    resolve(test());
  });
};
