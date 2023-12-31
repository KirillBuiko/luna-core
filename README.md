# Компонент "Ядро"
Компонент отвечает за маршрутизацию и доставку сообщений от одних компонентов/клиентов 
к другим. Написан на TypeScript, Node.Js.
### Где и как развёрнут
Развёрнут на общем сервере через docker-compose (файл docker-compose.yaml), 
порты 5051 для REST, 5052 для GRPC 
### Где конфигурация
Конфигурация хостов всех компонентов указана в docker-compose, core -> environment.
Порты серверов ядра указаны в .env. 
Обработчики компонентов прописываются в файлах проекта, 
src/endpoints/index.ts (для информации, менять их никто не сможет)
### Как поднять
Поднять/остановить все описанные в docker-compose образы:  
`$ sudo docker compose up -d --build` (если нужен вывод, убрать -d)  
`$ sudo docker compose down`


Чтобы поднять локально - скопируйте файлы docker-compose.yaml и .env с сервера и выполните команды выше.
### Как делать запросы
Из-за специфики ядра как таковых тестовых запросов нет, потому что 
для проверки запросов нужно минимум два узла - отправляющий и принимающий.
Поэтому проверить можно только "пустые" запросы, которые вернут ошибку о 
невозможности подключения к конечной точке (конечно, пока не будет к ней доступа)
### Вид запросов
Всего есть два запроса - _Get_ и _Set_. 
_Get_ отвечает за получение данных во всех смыслах 
(получение из хранилища, генерацию, исполнение и т.д.). 
_Set_ за установку значения (создание, обновление, удаление). 
Эти запросы отличаются подходом к формированию и передаче данных. 
Далее будет описано в общем случае, что они из себя представляют
#### Get запрос
В качестве запроса отправляется сущность вида (формат ts файла):  
```
interface GetRequestInfo {
  'requestType': RequestType;
  'infoType': "variableGetInfo"|"taskGetInfo"|"...";
  'variableGetInfo'?: VariableGetInfo;
  'taskGetInfo'?: TaskGetInfo;
  ...
}
```
, где '_name_ GetInfo' - информация для получения _name_ (вложенный объект),  
'infoType' - строка '_name_ GetInfo',  
'requestType' - одна из строк:
```
RequestType =
  | 'VARIABLE' (получить/записать значение переменной)
  | 'VARIABLE_LIST' (получить список переменных)
  | 'PROGRAM' (получить/записать программу)
  | 'PROGRAM_GENERATE' (сгенерировать программу)
  | 'PROGRAM_EXECUTE' (исполнить программу)
  | 'PROGRAM_INTERPRET' (интерпретировать программу)
  | 'TASK' (получить/записать задачу)
  | 'TASK_LIST' (получить список задач)
  | 'TASK_PLAN' (спланировать задачу)
  | 'COMPUTATIONAL_MODEL' (получить/записать ВМ)
  | 'COMPUTATIONAL_MODEL_LIST' (получить список ВМ)
  | 'MODULE' (получить/записать модуль)
  | 'MODULE_LIST' (получить список модулей)
  | 'MODULE_INFO' (получить о модуле)
  | ...
```
В ответ приходит поток бинарных данных в порядке:  
Первое сообщение - информация отправляемых данных вида:
```
interface DataRequestInfo {
  'requestType': RequestType;
  'infoType': "variableDataInfo"|"taskDataInfo";
  'dataType': DataType;
  'variableDataInfo'?: VariableDataInfo;
  'taskDataInfo'?: TaskDataInfo;
  ...
}
```
, где dataType описывает, какой вид имеют данные:
```
DataType =
  | 'FILE' (поток из файла)
  | 'TEXT' (текстовый формат)
  | 'JSON' (все данные переданы в объекте DataInfo)
  | 'LINK' (ссылка на ресурс)
```
Все остальные сообщения, переданные в потоке, являются данными ответа на запрос.
Если тип данных JSON, сообщений больше передано не будет.
#### Set запрос
По сути, является обратным Get запросом. 
Сначала отправляет DataRequestInfo, потом данные, если нужно, 
в ответ получает GetRequestInfo.
#### REST - Get
Для выполнения Get запроса через HTTP нужно выполнить GET запрос /get, 
передав в параметрах URL в поле info с GetRequestInfo JSON:  
`GET /get?info={...}`  
Далее все данные будут отправленны в потоке описанным выше образом.
#### REST - Set
Для выполнения Set запроса через HTTP нужно выполнить POST запрос /set,
передав в тело form-data с DataRequestInfo JSON в поле 'info' и данными в поле 'data'.  
В ответ придёт GetRequestInfo JSON
