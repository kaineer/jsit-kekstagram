// tests/lib/basic/suite.js

// var branchName = getBranchName();
// var parsedName = parseBranchName(branchName);
//
// var taskDirectories = findTaskDirectories(parsedName);
//
// var suite = new Suite(branchName);
//
// taskDirectories.forEach(function(directory) {
//   suite.runTestByType(directory, 'node');
//   suite.runTestByType(directory, 'phantom');
//
//
// });

// Выделяем номер задания
// Выполняем все доступные в файловой системе тесты
//   у которых либо номер модуля меньше текущего
//   либо номер модуля тот же, а номер таска - меньше или равен

// Файлы раскладываем следующим образом
// tests/lib/
//          /moduleX-taskY/node-test.js // -- тест выполняется в node
//                        /phantomjs-test.js // -- тест выполняется в phantomjs-test

// При выполнении каждого теста формируется файл в папке
// tests/reports/
//              /moduleX-taskY/node-results.json
//                            /phantom-results.json

var parseBranchName = require('../utils/parameters').parseBranchName;
var logger = require('../utils/logger');
var config = require('../config');

var Suite = module.exports = function(branchName) {
  var branch = parseBranchName(branchName);

  this.moduleId = branch.moduleId;
  this.taskId = branch.taskId;
};

var sp = Suite.prototype;

sp.run = function() {
  logger.debug('TEST_ROOT=' + config.tests_root);
};
