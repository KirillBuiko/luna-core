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

Чтобы поднять локально, скопируйте файлы docker-compose.yaml и .env с сервера и выполните команды выше.

### Как делать запросы

Из-за специфики ядра как таковых тестовых запросов нет, потому что
для проверки запросов нужно минимум два узла - отправляющий и принимающий.
Поэтому проверить можно только "пустые" запросы, которые вернут ошибку о
невозможности подключения к конечной точке (конечно, пока не будет к ней доступа)

# REST API

Всего есть два запроса - _/get_ и _/set_.  
_/get_ отвечает за получение данных во всех смыслах
(получение из хранилища, генерацию, исполнение и т.д.).
_/set_ за установку значения (создание, обновление, удаление).
Эти запросы отличаются подходом к формированию и передаче данных.
<table>
<thead>
<tr>
<th> Описание </th>
<th> Запрос </th>
<th> info параметр (get) / тело запроса (set) </th>
<th> Ответ </th>
</tr>
</thead>
<tr>
<th colspan="4" style="text-align: center">

### Библиотека модулей

</th>
</tr>
<tr>
<td>

**Запрос списка  
фрагментов кода**
</td>
<td> 

GET /get
</td>
<td> 

```
{
    requestType: "CODE_FRAGMENT_LIST"
}
```

</td>
<td> 

**Multipart**  
info:

```
{
    requestType: "CODE_FRAGMENT_LIST",
    dataType: "JSON",
    dataValueType: "codeFragmentList",
    codeFragmentList: {
        value: "результат"
    }
}
```

</td>
</tr>
<tr>
<td>

**Запрос информации  
о фрагменте кода**
</td>
<td> 

GET /get
</td>
<td> 

```
{
    requestType: "CODE_FRAGMENT_INFO",
    getInfoType: "codeFragmentInfoGet",
    codeFragmentInfoGet: {
        id: "идентификатор"
    }
}
```

</td>
<td> 

**Multipart**  
info:

``` 
{
    requestType: "CODE_FRAGMENT_INFO",
    dataType: "JSON",
    dataValueType: "codeFragmentInfo",
    codeFragmentInfo: {
        value: "результат"
    }
} 
```

</td>
<tr>
<td>

**Добавить фрагмент кода**
</td>
<td> 

POST /set
</td>
<td> 

**Multipart**  
info:

```
{
    requestType: "CODE_FRAGMENT",
    dataType: "FILE",
    dataValueType: "codeFragment",
    codeFragment: {
        getInfo: {
            id: "Идентификатор ФК"
        },
        codeFragmentJson: (json фрагмента кода)
    }
}
```

data: файл архива .tar
</td>
<td> 

```
{
    requestType: "CODE_FRAGMENT",
}
```

</td>
</tr>
<tr>
<td>

**Получить файлы  
фрагмента кода**
</td>
<td> 

GET /get
</td>
<td> 

```
{
    requestType: "CODE_FRAGMENT",
    getInfoType: "codeFragmentGet",
    codeFragmentGet: {
        id: "идентификатор"
    }
}
```

</td>
<td> 

**Multipart**  
info:

```
{
    requestType: "CODE_FRAGMENT",
    dataType: "FILE"
}
```

data: файл архива .tar
</td>
</tr>
<tr>
<td>

**Получить обработанный  
плагином фрагмент кода**
</td>
<td> 

GET /get
</td>
<td> 

```
{
    requestType: "CODE_FRAGMENT_PLUGIN_PROCEDURE",
    getInfoType: "codeFragmentPluginProcedureGet",
    codeFragmentPluginProcedureGet: {
        codeFragmentId: "идентификатор ФК";
        type: "тип выполнения";
    }
}
```

</td>
<td> 

**Multipart**  
info:

```
{
    requestType: "CODE_FRAGMENT_PLUGIN_PROCEDURE",
    dataType: "JSON",
    dataValueType: "codeFragmentPluginProcedure",
    codeFragmentPluginProcedure: {
        value: "результат"
    }
}
```

data: файл
</td>
</tr>
<tr>
<td>

**Получить список  
плагинов ФК**
</td>
<td> 

GET /get
</td>
<td> 

```
{
    requestType: "CODE_FRAGMENT_PLUGINS_LIST",
    getInfoType: "codeFragmentPluginsListGet",
    codeFragmentPluginsListGet: {
        codeFragmentId: "идентификатор"
    }
}
```

</td>
<td> 

**Multipart**  
info:

```
{
    requestType: "CODE_FRAGMENT_PLUGINS_LIST",
    dataType: "JSON",
    dataValueType: "codeFragmentPluginsList",
    codeFragmentPluginsList: {
        value: "результат"
    }
}
```

</td>
</tr>
<tr>
<td>

**Добавить плагин**
</td>
<td> 

POST /set
</td>
<td> 

**Multipart**  
info:

```
{
    requestType: "CODE_FRAGMENT_PLUGIN",
    dataType: "FILE",
    dataValueType: "codeFragmentPlugin",
    codeFragmentPlugin: {
        getInfo: {
            pluginId: "идентификатор плагина"
        },
    }
}
```

data: файл
</td>
<td> 

```
{
    requestType: "CODE_FRAGMENT_PLUGIN"
}
```

</td>
</tr>
</table>
