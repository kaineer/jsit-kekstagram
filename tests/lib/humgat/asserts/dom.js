// tests/lib/humgat/asserts/dom.js

var DOM = module.exports = function DOM(humgat) {
  this.humgat = humgat;
};

var dp = DOM.prototype;

dp.assertEqual = function(expected, fn, message) {

  var humgat = this.humgat;
  var page = humgat.getPage();

  var actual = page.evaluate(fn);
  var result = expected === actual;

  humgat.emit('console.log', expected, actual);

  if(!result) {
    humgat.emit('assert.fail');
  }

  humgat.addResult({
    title: message,
    result: result ? 'SUCCESS' : 'FAILURE'
  });

  return result;
};
