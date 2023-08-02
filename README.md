# Проектная работа REST API для проекта ["Mesto"]


## Описание:

REST API для проектной работы ["Mesto"](https://github.com/Elena-80/express-mesto-gha), связанное с базой данных MongoDB. При запуске приложения оно подключается к серверу mongo по адресу: `mongodb://localhost:27017/mestodb`.
В приложении описана схема пользователя и схема карточки. Некоторые поля схем проверяются регулярным выражением. 


[Проектная работа "Mesto" на GitHub Pages](https://elena-80.github.io/mesto/) 

## Функционал:

### Роуты для пользователей: 

* GET /users - возвращает всех пользователей; 
* GET /users/:userId - возвращает пользователя по переданному _id; 
* POST /users - создает пользователя с переданными в теле запроса name, about и avatar;
* PATCH /users/me - обновляет профиль; 
* PATCH /users/me/avatar - обновляет аватар; 

### Роуты для карточек:

* GET /cards - возвращает все карточки из базы данных; 
* POST /cards - создаёт карточку с переданными в теле запроса name и link. 
* DELETE /cards/:cardId - удаляет карточку по переданному _id; 

## Технологии:

* expressjs
* API REST 
* MongoDB 
* RegExp 

## Инструкция по установке:

Клонировать репозиторий:

* `git clone https://github.com/Elena-80/express-mesto-gha.git`

В директории проекта запустить приложение в режиме разработки:

* `npm install` - устанавливает зависимости; 
* `npm run dev` - запускает сервер с hot-reload;
* `npm run start` — запускает сервер 


## Языки:

* JavaScript
* RegExp 

## Библиотеки:

* expressjs

## База данных: 

* MongoDB 
