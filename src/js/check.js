// src/js/check.js

var getMessage = function(a, b) {
  if(typeof (a) === 'boolean') {
    if(a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    }
  }

  if(typeof (a) === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b*4) + ' атрибутов';
  }

  if(b) {
    for(var i = 0, s = 0; i < a.length; ++i) {
      s += a[i] * b[i];
    }

    return 'Общая площадь артефактов сжатия: ' + s + ' пикселей';
  } else {
    for(var i = 0, s = 0; i < a.length; ++i) {
      s += a[i];
    }

    return 'Количество красных точек во всех строчках изображения: ' + s;
  }
}
