// --- tests/lib/basic.js

var getBranchName = require('./utils/parameters').getBranchName;

var Suite = require('./basic/suite');

var runBasicCriterions = module.exports = function() {
  // Выделяем модуль
  var suite = new Suite(getBranchName());
  suite.run();
};
