# REST API

### Библиотека модулей
[Документация компонента](https://gitlab.com/ansab3/codefragmentcontrolsystem/-/blob/main/USE.md?ref_type=heads)

| Описание                                                  | Запрос                                                   | Тело запроса                                    | Ответ                                                            |
|-----------------------------------------------------------|----------------------------------------------------------|-------------------------------------------------|------------------------------------------------------------------|
| **Запрос списка <br>фрагментов кода**                     | GET  /api/v2/code-f-storage/list                         |                                                 | 200 **Multipart:**<br> data octet-stream: json список            |
| **Запрос информации <br>о фрагменте кода**                | GET  /api/v2/code-f-storage/info/{id}                    |                                                 | 200 **Multipart:**<br> data octet-stream: json описание          |
| <span style="color:red">**Добавить фрагмент кода**</span> | POST /api/v2/code-f-storage/fragment/{id}                | **Multipart:**<br> data octet-stream: архив tar | 204                                                              |
| **Получить файлы <br>фрагмента кода**                     | GET  /api/v2/code-f-storage/fragment/{id}                |                                                 | 200 **Multipart:**<br> data octet-stream: архив tar              |
| **Получить обработанный <br>плагином фрагмент кода**      | GET  /api/v2/code-f-storage/procedure/{id}?type="плагин" |                                                 | 200 **Multipart:**<br> data octet-stream: json с фрагментом кода |
| **Получить список <br>плагинов ФК**                       | GET  /api/v2/code-f-storage/plugins-list                 |                                                 | 200 **Multipart:**<br> data octet-stream: json список            |
| <span style="color:red">**Получить плагин**</span>        | GET  /api/v2/code-f-storage/plugin/{id}                  |                                                 | 200 **Multipart:**<br> data octet-stream: архив tar              |
| <span style="color:red">**Добавить плагин**</span>        | POST /api/v2/code-f-storage/plugin/{id}                  | **Multipart:**<br> data octet-stream: архив tar | 204                                                              |

### Хранилище переменных
[Документация компонента](https://t.me/c/1845197994/663/723)

| Описание                                                      | Запрос                          | Тело запроса                                      | Ответ                                                |
|---------------------------------------------------------------|---------------------------------|---------------------------------------------------|------------------------------------------------------|
| **Получить список значений переменных**                       | GET    /api/v2/var-storage/list |                                                   | 200 **Multipart:**<br> data octet-stream: json список |
| **Получить значение переменной**                              | GET    /api/v2/var-storage/{id} |                                                   | 200 **Multipart:**<br> data octet-stream: массив байт |
| **Добавить значение переменной**                              | POST   /api/v2/var-storage      | **Multipart:**<br> data octet-stream: массив байт | 201 application/json {id: string}                    |
| **Удалить значение переменной**                               | DELETE /api/v2/var-storage/{id} |                                                   | 204                                                  | 

### Вид ошибок
#### Общий вид:
```json
{
  "reason": "причина ошибки (ниже)",
  "message": string | object
}
```

#### Причины ошибок и их HTTP коды:  
**endpoint-error** (ошибка на стороне конечной точки): 502  
**invalid-argument** (неправильный запрос): 400  
**not-supported** (неподдерживаемый запрос): 405  
**unavailable** (неподдерживаемый запрос): 502  
**unknown** (неизвестно): 500  