// tests/lib/humgat/index.js

var EventEmitter = require('./event-emitter.js');
var fs = require('fs');
var logger = require('./logger.js');
var DOM = require('./asserts/dom.js')

var Humgat = module.exports = function() {
  this.dom = new DOM(this);
  this.results = [];
};

Humgat.create = function() {
  return new Humgat();
};

var hp = Humgat.prototype;

hp.on = EventEmitter.on;
hp.off = EventEmitter.off;
hp.emit = EventEmitter.emit;

hp.exitWithJSON = function(json) {
  var string;

  try {
    json.log = logger.getMessages(this.config.log);
    string = JSON.stringify(json, null, 2);
  } catch(err) {
    string = JSON.stringify({
      result: 'FAILURE',
      reason: 'Не удалось вывести результат'
    }, null, 2);
  }

  console.log(string);
  phantom.exit();
};

hp.run = function() {
  this.testResult = true;
  this.assertResults = [];

  this.emit('humgat.config'); // take config from somewhere
  this.emit('humgat.start');  // start opening page

  this._setupExitTimeout();
};

hp.exitOnFailure = function(reason) {
  this.exitWithJSON({
    result: 'FAILURE',
    reason: reason
  });
};

hp.exitWithSuiteResults = function() {
  var result = this.testResult;

  this.exitWithJSON({
    title: (this.title || 'Задание без имени'),
    type: 'phantom',
    result: (result ? 'SUCCESS' : 'FAILURE'),
    asserts: this.assertResults
  });
};

hp.viewport = function(w, h) {
  var page = this.getPage();

  if(arguments.length === 1) {
    page.viewportSize = w;
  } else {
    page.viewportSize = {
      width: w,
      height: h
    };
  }
};

hp.open = function() {
  var humgat = this;
  var page = this.getPage();
  var config = this.config;

  page.open(config.url, function(status) {
    if(status === 'success') {
      humgat.emit('page.open.success');
    } else {
      humgat.emit('page.open.failure');
    }
  });
};

hp.getPage = function() {
  var page = this.page;

  if(!page) {
    page = this.page = require('webpage').create();
    this._initializePage(page);
    this._initializeResources(page);
  }

  return page;
};

hp.addResult = function(obj) {
  this.assertResults || (this.assertResults = []);
  this.assertResults.push(obj);
};

hp.addFailure = function(message) {
  this.addResult({
    title: message,
    result: 'FAILURE'
  });
};

hp.addSuccess = function(message) {
  this.addResult({
    title: message,
    result: 'SUCCESS'
  });
};

hp._setupExitTimeout = function() {
  var timeout = (this.config && this.config.timeout) || 2000;
  var humgat = this;

  setTimeout(this.exitOnFailure.bind(this, 'Timeout'), timeout);
};

hp._setConfiguration = function setConfiguration(config) {
  this.config = config;
};

hp._initializePage = function(page) {
  var humgat = this;

  page.onConsoleMessage = function(message) {
    humgat.emit('page.console', message);
  };

  page.onInitialized = function() {
    humgat.emit('page.initialized');
  };

  page.onLoadStarted = function() {
    humgat.emit('page.load.started');
  };

  page.onLoadFinished = function(status) {
    if(status === 'success') {
      humgat.emit('page.loaded');
    } else {
      humgat.emit('page.load.failure');
    }
  };
};

hp._initializeResources = function(page) {
  var humgat = this;

  page.onResourceRequested = function(requestData, networkRequest) {
    humgat.emit('resource.requested', requestData, networkRequest);
  };

  page.onResourceReceived = function(response) {
    humgat.emit('resource.received', response);
  };

  page.onResourceError = function(error) {
    humgat.emit('resource.error', error);
  };
};
