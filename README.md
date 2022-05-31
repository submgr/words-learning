# Веб-приложение для заучивания слов на других языках

Данное веб-приложение создано как задание участия в международной олимпиаде «Волга-IT`22».

Задача заключалась в разработке Web-приложения, помогающего учить английские слова.
На занятиях по английскому языку пользователь получает несколько слов или выражений, которые ему необходимо запомнить. Из них он составляет таблицу в Excel или другой программе, в которой содержатся 2 столбца: в первом слова на английском языке, во втором - перевод на русский. 

Попробовать можно прямо сейчас с моего сервера: https://test.deqstudio.com/volgait/
## Демонстрация функционала на видео

https://user-images.githubusercontent.com/18516370/171263617-e7cd3fb4-bf60-4bb3-86f5-997c3f3fecd8.mp4

## Реализованный функционал

Пользователь может добавлять и просматривать добавленные ранее словари. Для добавления нового словаря достаточно указать его название и прикрепить заполненный Excel файл.
Предполагается следующий формат для таблицы представления, пример:

|RUS|ENG|Image|
|-----|-----|-----|
|Шкаф|Closet|closet.jpg|
|...|...|...|

В первом столбце слова на английском языке, во втором - перевод на русский. Первой строкой должен
быть заголовок с трехбуквенным кодом языка.

В третьем столбце указывается наименование соответствующей паре слов изображение. Визуальные асоциации позволят лучше запоминать слова и не терять из активного вокабуляра.
Впрочем, третий столбец опционален. При загрузке словаря есть возможность прикрепить архив с изображениями, именно поэтому важно указывать в третьем столбце такие же наименования файлов, как и данные им в архиве. Загруженный архив распаковывается после на стороне сервера и хранится в уникальной точке расположения.

Пользователь может прослушивать слова. Для этого используется технология синтезации голоса из текста, которая уже долгое время является функцией многих современных версий браузеров.
Важно: есть некоторые нюансы в работе этой плюшки, которые, к сожалению, находятся за гранью веб-разработчика. Так, в некоторых сборках операционных систем синтезация может не работать, из-за отсутствия системных компонентов синтезации.
Например, в моей сборке Manjaro синтезация не работает во всех ее реализациях, во всех браузерах, даже в демонстрации возможностей синтеза на сайте w3schools. Однако, на моем Android устройстве воспроизведение текста слов в представленном в данном репозитории проекте работает без проблем!

Пример работы синтеза текста:
https://user-images.githubusercontent.com/18516370/171266880-bda3671c-65e7-43ed-8f67-584cd445f767.mp4

Так же, можно посмотреть сразу слова из всех словарей. Эта возможность представлена в формате функциональной таблицы. Вот как это выглядит:
![image](https://user-images.githubusercontent.com/18516370/171267379-2044c0b9-dbe7-49a8-88dd-389b0a85553d.png)

Помимо функционала, визуальная часть была тоже проработана. Интерфейс выглядит современно и просто, является адаптивным.

# Техническая часть

Стек:
   Front — JS \ JQuery (+ библиотеки: TablerUI, DataTable)
   Back — PHP (+ библиотеки: PHPSpreadsheet, + PHPDotEnv)
   
Как во Frontend, так и в Backend не использовались фреймворки. Почему: было бы странно использовать фреймворки в PHP, поскольку к предоставленной задаче оптимальнее подойти без них, используя ванильные возможности PHP, дополня их некоторыми библиотеками.
Во Frontend части так же не использовались фреймворки, поскольку на мой взгляд это не имеет смысла в контексте решаемой задачи.

Как результат, я завершил работу буквально за 1,5 размеренных дня полностью БЕЗ использования фреймворков в проекте.

## Настройка

Frontend никаких подготовок к работе и поднастроек не требует. Необходима лишь работа с Backend частью, поэтому следующие действия необходимо выполнять в подкаталоге */backend* проекта
Поскольку по ТЗ заявлено требование не загружать папку vendor как часть проекта, она не было загружена. Это в свою очередь значит, что для запуска проекта, необходимо загрузить и подготовить необходимые библиотеки с помощью composer.
Впрочем, импортировать папку vendor такой же дурной тон, как и загружать в открытый репозиторий заполненный файл .env :)

Проект протестирован с Linux x64/ PHP 8.0.1 (+ все стандартные модули вроде gd).

Настройте composer и установите 2 библиотеки:
```
composer require phpoffice/phpspreadsheet
composer require vlucas/phpdotenv

composer install
```

После установки, в рабочей области появится папка vendor; именно к ней программный PHP код данного проекта и обращается в поисках необходимых библиотек.

Далее, необходимо настроить базу данных. Для работы данного проекта потребуется определенная структура, используйте заранее подготовленный SQL файл для ее импорта:
[volgait.txt](https://github.com/submgr/words-learning-cards/files/8808800/volgait.txt)
Важно: из-за ограничений Github, я не смог загрузить файл дампа базы данных в правильном для нее формате, поэтому переименовал в .txt в целях успешной загрузки. Вам же потребуется переименовать файл перед импортом, изменив расширение с .txt на .sql!

После того, как подготовка базы данных прошла успешно, не забудьте указать приложению данные для подключений к ней.
В корне папки */backend* представлен файл .env.example. Заполните переименуйте его в .env, чтобы закончить.

*Пояснения по заполнению файла .env:
DBHOST — указываете адрес хоста базы данных, если порт нестандартный (то есть, не равен 3306), то указываем его обязательно!
DBNAME — указываете наименование базы данных,
DBUSER — указываете имя пользователя,
DBPASS — указываете пароль пользователя.*

Готово! Веб-приложение готово к работе. Приятного использования!