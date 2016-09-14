// --- tests/lib/index.js

var path = require('path');
var chalk = require('chalk');

// 9. Проверяем конфигурацию
// 9. Проверяем тесты в наличии
// 9. Проверяем, что за ветка


// switch (process.env.TEST_CONFIG) {
//   case 'eslint':
//     runESLint(); // Если конфигурация === 'eslint', то и запускаем только его
//     break;
//
//   case 'basic':
//     break;
//
//   case 'advanced':
//     break;
// }

runESLint();

// Проверить код на соответствие стилю
function runESLint() {
  var CLIEngine = require('eslint').CLIEngine;

  var cliConfig = {
    configFile: path.resolve('./.eslintrc'),
    cwd: path.resolve('./')
  };

  var cli = new CLIEngine(cliConfig);

  var report = cli.executeOnFiles(['src/']);

  if(report.errorCount > 0) {
    reportESLintErrors(report.results);

    console.log(chalk.bold.red('Error count: ' + report.errorCount));
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function reportESLintErrors(results) {
  var padLeft = function(num, positions) {
    var str = '' + num;
    while(str.length < positions) {
      str = ' ' + str;
    }
    return str;
  };

  var padRight = function(val, positions) {
    var str = '' + val;
    while(str.length < positions) {
      str = str + ' ';
    }
    return str;
  };

  var messageSplit = function(messageText, column) {
    var i = column - 1;

    var before = messageText.substr(0, column - 1);
    var letter = messageText.substr(column - 1, 1);
    var after = messageText.substr(column);

    return before + chalk.yellow(letter) + after;
  };

  results.forEach(function(result) {
    console.log(chalk.bold('File: ' + result.filePath.substr(process.cwd().length)));
    result.messages.forEach(function(message) {
      // console.log(message);

      console.log(
        chalk.yellow(padLeft(message.line, 3) + ':' +
        padLeft(message.column, 3)) + ', ' +
        chalk.cyan(message.message)
      );
      console.log(
        '   Code: ' +
        chalk.gray(messageSplit(message.source, message.column))
      );
    });
  });
}
