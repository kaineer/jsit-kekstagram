// tests/lib/tasks/module2-task1/phantom-test.js

var humgat = require('../../humgat').create();
require('../../humgat/common')(humgat);

humgat.on('page.open.success', function() {
  var page = this.getPage();

  this.title = 'Canvas';

  page.onFilePicker = function() {
    // return '/home/kaineer/devel/html-academy/js-intensive-x/kekstagram/src/photos/1.jpg';
    return './src/photos/1.jpg';
  };

  var onPictureUploaded = function() {
    page.evaluate(function() {
      // Канва будет создана непосредственно перед первой отрисовкой
      var canvas = document.querySelector('canvas');
      canvas.style.left = '0px';
      canvas.style.top = '0px';

      var uploadControls = document.querySelector('.upload-form-controls');
      uploadControls.style.display = 'none';

      var resizeControls = document.querySelector('.upload-resize-controls');
      resizeControls.style.display = 'none';
    });

    humgat.cliprect(264, 5, 602, 598);

    humgat.screenshot.assertSamePicture('Скриншот после загрузки');
    humgat.emit('suite.done');
  };

  this.emit('page.cleanup');

  this.page.uploadFile('label.upload-file', './src/photos/1.jpg');

  setTimeout(onPictureUploaded, 500);
}).on('page.cleanup', function() {
  var page = this.getPage();

  page.evaluate(function() {
    var elements = document.querySelectorAll('body > *');
    var element;

    for(var i = 0; i < elements.length; i += 1) {
      element = elements[i];

      if(element.className === 'upload') {
        //
      } else {
        element.style.display = 'none';
      }
    }
  });
}).run();
