// src/js/check.js

'use strict';

/* eslint no-unused-vars:0 */

var getMessage = function(a, b) {
  var i, s = 0;

  if(typeof (a) === 'boolean') {
    if(a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    }
  }

  if(typeof (a) === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
  }

  if(b) {
    for(i = 0; i < a.length; ++i) {
      s += a[i] * b[i];
    }

    return 'Общая площадь артефактов сжатия: ' + s + ' пикселей';
  } else {
    for(i = 0; i < a.length; ++i) {
      s += a[i];
    }

    return 'Количество красных точек во всех строчках изображения: ' + s;
  }
}
