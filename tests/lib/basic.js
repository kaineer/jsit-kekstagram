// --- tests/lib/basic.js

var getBranchName = require('./utils/parameters').getBranchName;

var Suite = require('./basic/suite');

var logger = require('./utils/logger');

var runBasicCriterions = module.exports = function() {
  // Выделяем модуль
  var suite = new Suite(getBranchName());

  logger.debug('runBasicCriterions()');

  suite.run().then(
    function() {
    },

    function() {
      process.exit(1);
    }
  );
};
