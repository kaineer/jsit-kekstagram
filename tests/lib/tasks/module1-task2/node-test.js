// tests/lib/tasks/module1-task2/node-test.js
var path = require('path');
var fs = require('fs');

var ASSERT_SUCCESS = 'SUCCESS';
var ASSERT_FAILURE = 'FAILURE';

var NodeTestCase = function(name, hash) {
  this.name = name;
  this.result = true;
  this.asserts = [];

  if(hash) {
    Object.assign(this, hash);
  }
};

Object.assign(NodeTestCase.prototype, {
  run: function() {
    try {
      this.runAsserts(); // should be implemented in super-class
    } catch(err) {
    }

    return {
      result: this.result ? 'SUCCESS' : 'FAILURE',
      title: this.title,
      type: 'node',
      task: this.name,
      asserts: this.asserts
    };
  },

  assertEqual: function(expected, actual, message) {
    this.assert(expected === actual, message);
  },

  assert: function(condition, message) {
    if(condition) {
      this._addSuccess(message);
    } else {
      this._addFailure(message);
    }

    return condition;
  },

  fatalAssert: function(condition, message) {
    if(!this.assert(condition, message)) {
      throw new Error(message);
    }
  },

  _addSuccess: function(message) {
    this.asserts.push({ title: message, result: ASSERT_SUCCESS });
  },

  _addFailure: function(message) {
    this.asserts.push({ title: message, result: ASSERT_FAILURE})
    this.result = false;
  }
});

var testModule1Task2 = module.exports = function() {
  var testCase = new NodeTestCase('module1-task2', {
    title: 'Начинаем программировать',
    runAsserts: function() {
      var getMessage = this._getMessage();

      this.fatalAssert(
        'function' === typeof (getMessage),
        'Функция должна быть определена'
      );

      this.assertEqual(
        'Переданное GIF-изображение анимировано и содержит 38 кадров',
        getMessage(true, 38),
        'Результат при a === true'
      );

      this.assertEqual(
        'Переданное GIF-изображение не анимировано',
        getMessage(false),
        'Результат при a === false'
      );

      this.assertEqual(
        'Переданное SVG-изображение содержит 38 объектов и 32 атрибутов',
        getMessage(38, 8),
        'Результат, если a - число'
      );

      this.assertEqual(
        'Количество красных точек во всех строчках изображения: 15',
        getMessage([1, 2, 3, 4, 5]),
        'Результат, если a - массив'
      );

      this.assertEqual(
        'Общая площадь артефактов сжатия: 30 пикселей',
        getMessage([1, 2, 3, 4, 5], [2, 2, 2, 2, 2]),
        'Результат, если a и b - массивы'
      );
    },

    _getMessage: function() {
      var checkJSPath = path.resolve('./src/js/check.js');
      var text;
      var fn = null;

      this.fatalAssert(
        fs.statSync(checkJSPath).isFile(),
        'Файл должен быть создан'
      );

      text = fs.readFileSync(checkJSPath, 'utf-8');

      // Eval в анонимном контексте
      fn = (function() {
        var window = {};
        eval(text);

        if(typeof (getMessage) === 'undefined') {
          return window.getMessage;
        } else {
          return getMessage;
        }
      })();

      return fn;
    }
  });

  return testCase.run();
};
