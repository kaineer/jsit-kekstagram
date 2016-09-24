// tests/lib/humgat/asserts/screenshot.js

var Screenshot = module.exports = function Screenshot(humgat) {
  this.humgat = humgat;
};

var sp = Screenshot.prototype;

sp.assertSamePicture = function(message, treshold) {

  var humgat = this.humgat;
  var page = humgat.getPage();

  if(typeof treshold === 'undefined') {
    treshold = 99.99;
  }


};
