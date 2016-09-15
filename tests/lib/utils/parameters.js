// tests/lib/utils/parameters.js

var fs = require('fs');
var execSync = require('child_process').execSync;

var parameters = module.exports = {
  getBranchName: function() {
    var branchName = 'master';

    if(process.env.TRAVIS === 'true') {
      // It should be set from travis script
      branchName = process.env.GITHUB_BRANCH;
    } else {
      // Local branch name
      branchName = execSync('git rev-parse --abbrev-ref HEAD').toString();
    }

    return branchName.trim();
  },
  parseBranchName: function(branchName) {
    var RE = /module(\d+)-task(\d+)/;
    var md = RE.exec(branchName);

    if(md) {
      return { module: +md[1], task: +md[2] };
    } else {
      return { module: 0, task: 0 };
    }
  }
};
