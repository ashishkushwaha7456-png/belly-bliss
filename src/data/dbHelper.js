import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

function readDB() {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getFoods() {
    return readDB().foods;
}

export function saveFoods(foods) {
    const db = readDB();
    db.foods = foods;
    writeDB(db);
}

export function getMessages() {
    return readDB().messages;
}

export function saveMessages(messages) {
    const db = readDB();
    db.messages = messages;
    writeDB(db);
}

export function getSubscribers() {
    const db = readDB();
    return db.subscribers || [];
}

export function saveSubscribers(subscribers) {
    const db = readDB();
    db.subscribers = subscribers;
    writeDB(db);
}

export function getPages() {
    const db = readDB();
    return db.pages || {};
}

export function savePages(pages) {
    const db = readDB();
    db.pages = pages;
    writeDB(db);
}
