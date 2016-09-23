// --- tests/lib/basic.js

var getBranchName = require('./utils/parameters').getBranchName;

var Suite = require('./basic/suite');

var logger = require('./utils/logger');

var runBasicCriterions = module.exports = function() {
  // Выделяем модуль
  var suite = new Suite(getBranchName());

  logger.debug('runBasicCriterions()');

  suite.run().then(function(flag) {
    console.log('exit by flag');

    if(flag) {
      console.log(0);
      process.exit(0);
    } else {
      console.log(1);
      process.exit(1);
    }
  });
};
