// ========================================
// ТЕЛЕФОННАЯ КНИГА (Express + SQLite)
// ========================================
// Полный CRUD: создание, чтение, обновление, удаление контактов
// Технологии: Node.js, Express, SQLite, HTML/CSS
// ========================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// ---------------------------------------------------
// Функция для защиты от XSS (экранирует спецсимволы)
// ---------------------------------------------------
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ---------------------------------------------------
// Мидлвары: парсинг форм и статические файлы (CSS)
// ---------------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ---------------------------------------------------
// Подключение базы данных (файл phonebooks.db)
// ---------------------------------------------------
const db = new sqlite3.Database(path.join(__dirname, 'phonebooks.db'));

// ---------------------------------------------------
// Создание таблицы contacts (поля: id, name, phone, email)
// email — необязательное поле (без NOT NULL)
// ---------------------------------------------------
db.run(`
    CREATE TABLE IF NOT EXISTS phonebooks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT
    )
`);

// ===================================================
// 1. ГЛАВНАЯ СТРАНИЦА — форма для добавления контакта
// ===================================================
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Телефонная книга</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <h1>📒 Телефонная книга</h1>
            <form method="POST" action="/add-phonebook">
                <input type="text" name="name" placeholder="Имя" required>
                <br>
                <input type="text" name="phone" placeholder="Номер телефона" required>
                <br>
                <input type="email" name="email" placeholder="Email (необязательно)">
                <br>
                <button type="submit">➕ Добавить</button>
            </form>
            <hr>
            <a href="/api/phonebooks">📦 JSON</a> | <a href="/list">📋 Список контактов</a>
        </body>
        </html>
    `);
});

// ===================================================
// 2. JSON-СПИСОК (для API)
// ===================================================
app.get('/api/phonebooks', (req, res) => {
    db.all('SELECT * FROM phonebooks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// ===================================================
// 3. HTML-СПИСОК (таблица с кнопками)
// ===================================================
app.get('/list', (req, res) => {
    db.all('SELECT * FROM phonebooks', [], (err, rows) => {
        if (err) {
            res.status(500).send('Ошибка базы данных');
        } else {
            let rowsHtml = '';
            for (let contact of rows) {
                rowsHtml += `
                    <tr>
                        <td>${contact.id}</td>
                        <td>${escapeHtml(contact.name)}</td>
                        <td>${escapeHtml(contact.phone)}</td>
                        <td>${escapeHtml(contact.email || '')}</td>
                        <td>
                            <a href="/edit/${contact.id}">✏️ Изменить</a>
                            <a href="/delete/${contact.id}" onclick="return confirm('Удалить контакт?')">🗑 Удалить</a>
                            </td>
                    </tr>
                `;
            }
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Контакты</title>
                    <link rel="stylesheet" href="/css/style.css">
                </head>
                <body>
                    <h1>📞 Список контактов</h1>
                    <table border="1">
                        <thead>
                            <tr><th>ID</th><th>Имя</th><th>Телефон</th><th>Email</th><th>Действия</th></tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                    <br>
                    <a href="/">← На главную</a>
                </body>
                </html>
            `);
        }
    });
});

// ===================================================
// 4. РЕДАКТИРОВАНИЕ — форма
// ===================================================
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM phonebooks WHERE id = ?', [id], (err, contact) => {
        if (err || !contact) {
            res.status(404).send('Контакт не найден');
        } else {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Редактировать</title>
                    <link rel="stylesheet" href="/css/style.css">
                </head>
                <body>
                    <h1>✏️ Редактировать контакт</h1>
                    <form method="POST" action="/update-phonebook/${contact.id}">
                        <input type="text" name="name" value="${escapeHtml(contact.name)}" required>
                        <br>
                        <input type="text" name="phone" value="${escapeHtml(contact.phone)}" required>
                        <br>
                        <input type="email" name="email" value="${escapeHtml(contact.email || '')}">
                        <br>
                        <button type="submit">💾 Сохранить</button>
                    </form>
                    <br>
                    <a href="/list">← Назад</a>
                </body>
                </html>
            `);
        }
    });
});

// ===================================================
// 5. РЕДАКТИРОВАНИЕ — сохранение изменений
// ===================================================
app.post('/update-phonebook/:id', (req, res) => {
    const id = req.params.id;
    const { name, phone, email } = req.body;
    db.run('UPDATE phonebooks SET name = ?, phone = ?, email = ? WHERE id = ?',
        [name, phone, email, id],
        function(err) {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка при обновлении');
            } else {
                res.redirect('/list');
            }
        }
    );
});

// ===================================================
// 6. ДОБАВЛЕНИЕ контакта
// ===================================================
app.post('/add-phonebook', (req, res) => {
    const { name, phone, email } = req.body;
    db.run('INSERT INTO phonebooks (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email],
        function(err) {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка при добавлении');
            } else {
                res.redirect('/');
            }
        }
    );
});

// ===================================================
// 7. УДАЛЕНИЕ контакта по id
// ===================================================
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM phonebooks WHERE id = ?', id, function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка при удалении');
        } else {
            res.redirect('/list');
        }
    });
});

// ===================================================
// 8.ЗАПУСК СЕРВЕРА
// ===================================================
app.listen(3000, () => {
    console.log('Телефонная книга запущена на http://localhost:3000');
});