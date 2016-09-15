// tests/lib/tasks/module1-task2/phantom-test.js

var humgat = require('../../humgat').create();
require('../../humgat/common')(humgat);

// Предполагается, что phantom-тест по выполнению
//   выплюнет JSON, который съест запустивший процесс.

/*
  Этот тест должен проверить, что в загруженной странице
  определена функция getMessage
*/

humgat.on('page.open.success', function() {
  this.dom.assertEqual(
    'function', // expected value
    function() { return typeof (getMessage); },
    'Функция должна быть определена'
  ).catch(function() {
    this.emit('suite.failed');
  });

  this.emit('suite.done');
}).run();

/*
Что выводится в stdout:

1. Если произошёл сбой и тесты не смогли выполниться

{
  result: 'FAILURE'
}

2. Если тест прошёл нормально:

{
  result: 'DONE',
  tests: [
    { title: 'Функция должна быть определена', result: 'SUCCESS' }
  ]
}

3. Если тест провалился

{
result: 'DONE',
  tests: [
    { title: 'Функция должна быть определена', result: 'FAILURE' }
  ]
}

*/
