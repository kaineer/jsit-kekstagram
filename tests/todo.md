2016.09.21
----------

   * [ ] Phantomjs тест
     * [x] Переделать npmStart для запуска один раз, перед проверками
     * [ ] Переделать PhantomTest так, чтобы выдавать требуемый JSON
     * [ ] Обрабатывать ситуации, когда npm start не смог подняться
   * [ ] вывод результатов (после получения всех результатов)
   * [ ] из двух массивов - node и phantom тестов тоже сделать массив
   * [ ] reject делать только на самом верху, когда выяснится,
     что ошибки есть

   * [x] `_getTaskFolders` с префиксом
   * [x] возвращать из каждого теста promise
   * [x] массивы промисов скармливать в один `Promise.all`
   * [x] в basic.js делать process.exit(1), если промис отклонён.

   * [x] продумать, какую информацию возвращает {node,phantom} test

```javascript
// Например так
{
  title: 'Начинаем программировать',
  task: 'module1-task2',
  type: 'node',
  result: 'SUCCESS', // SUCCESS | FAILURE
  asserts: [
    {
      title: 'Функция должна быть определена',
      result: 'SUCCESS' // SUCCESS | FAILURE
    }
    // ...
  ]
}
```

   * [x] Полностью сделал node тест для Кекстаграм, m1t2
   * [x] Вынести NodeTestCase отдельно
