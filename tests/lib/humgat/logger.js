// tests/lib/humgat/logger.js

var logger = module.exports = {
  debug: function(message) {
    this.messages || (this.messages = []);
    this.messages.push(message);
  },
  getMessages: function(logConfig) {
    var tailSize = logConfig.tail_size;

    var result = {
      messages: (this.messages || []).slice(-tailSize),
      count: this.messages.length
    };

    if(this.messages.length > tailSize) {
      result.messages.unshift('...');
    }

    return result;
  }
};
