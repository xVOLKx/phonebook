# 📒 Телефонная книжка (Express + SQLite)

Веб-приложение для управления контактами: имя, телефон, email (CRUD). Данные хранятся в SQLite.

## Как 🚀 запустить

1. Установи [Node.js](https://nodejs.org/)
2. Склонируй репозиторий:
   ```bash
   git clone https://github.com/xVOLKx/phonebook.git
   ```
3. Перейди в папку проекта:
   ```bash
   cd phonebook
   ```
4. Установи зависимости:
   ```bash
   npm install express sqlite3
   ```
5. Запусти:
   ```bash
   node phonebook.js
   ``` 
6. Открой в браузере:
   ```bash
     http://localhost:3000
   ```

## 🖼️ Скриншоты

### Форма добавления контакта
![Форма добавления](/public/images/screenshot-form.png)

### Список контактов (с возможностью редактирования и удаления)
![Список контактов](/public/images/screenshot-list.png)

### JSON-вывод всех контактов (API)
![JSON-список](/public/images/screenshot-json.png)

## 🛠️ Технологии

- Node.js + Express
- SQLite
- HTML / CSS