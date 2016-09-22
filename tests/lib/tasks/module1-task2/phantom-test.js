// tests/lib/tasks/module1-task2/phantom-test.js

var humgat = require('../../humgat').create();
require('../../humgat/common')(humgat);

/*
  Этот тест должен проверить, что в загруженной странице
  определена функция getMessage
*/

humgat.on('page.open.success', function() {
  var result = this.dom.assertEqual(
    'function', // expected value
    function() {
      return typeof (getMessage);
    },
    'Функция `getMessage` должна быть определена'
  );

  if(!result) {
    this.emit('suite.failure');
  }

  this.emit('suite.done');
}).run();
