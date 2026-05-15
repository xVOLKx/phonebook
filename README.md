# 📒 Телефонная книжка (Express + SQLite)

Мини-приложение для добавления, просмотра, редактирования и удаления контактов (имя, телефон, email).

## Как запустить

1. Установи [Node.js](https://nodejs.org/)
2. Скачай репозиторий или склонируй:  
   git clone https://github.com/xVOLKx/phonebook.git
3. В папке проекта выполни:  
   npm install express sqlite3
4. Запусти сервер:  
   node phonebook.js
5. Открой в браузере:  
   http://localhost:3000

## Скриншоты

### Форма добавления контакта
![Форма добавления](/public/images/screenshot-form.png)

### Список контактов (с возможностью редактирования и удаления)
![Список контактов](/public/images/screenshot-list.png)

### JSON-вывод всех контактов (API)
![JSON-список](/public/images/screenshot-json.png)

## Технологии

- Node.js + Express
- SQLite
- HTML / CSS