export * from './BetterSqliteConnection';
export * from './BetterSqliteDriver';
export * from './BetterSqliteExceptionConverter';
export * from './BetterSqlitePlatform';
export * from './BetterSqliteSchemaHelper';
export * from '@mikro-orm/knex';

/*
const Database = require('better-sqlite3');
const Database_en = require('better-sqlite3-multiple-ciphers');

const db = new Database('foobar.db', { verbose: console.log });
const db_en = new Database_en('foobar_en.db', { verbose: console.log });

db_en.pragma("rekey='secret-key'");

const createTable = "CREATE TABLE IF NOT EXISTS users('name' varchar, 'username' varchar, 'password' varchar);"

db.exec(createTable);
db_en.exec(createTable);

const stmt = db.prepare('INSERT INTO users (name, username, password) VALUES (@name, @username, @password)')
const stmt_en = db_en.prepare('INSERT INTO users (name, username, password) VALUES (@name, @username, @password)')

const insertMany = db.transaction((users: any) => {
    for (const user of users) stmt.run(user);
});

const insertMany_en = db_en.transaction((users: any) => {
    for (const user of users) stmt_en.run(user);
});

insertMany([
    { name: 'Joey', username: "J", password: "password1"},
    { name: 'Sally', username: "S", password: "password2"},
    { name: 'Junior', username: "U", password: "password3" },
]);

insertMany_en([
    { name: 'Joey', username: "J", password: "password1"},
    { name: 'Sally', username: "S", password: "password2"},
    { name: 'Junior', username: "U", password: "password3" },
]);

db_en.close();
db.close(); */
