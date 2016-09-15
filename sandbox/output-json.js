// run with phantomjs

var output = {
  hello: 'PhantomJS'
};

console.log(JSON.stringify(output, null, 2));

phantom.exit(0);
