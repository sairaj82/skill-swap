import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initial seed data
const SEED_USERS = [
    {
        id: "1",
        name: "Alex Dev",
        email: "alex@example.com",
        password: "password", // In a real app, hash this!
        teaching: [
            { id: "101", name: "Advanced React Patterns", category: "Development" }
        ],
        learning: [
            { id: "102", name: "Jazz Guitar Improvisation", category: "Music" }
        ]
    },
    {
        id: "2",
        name: "Maria Garcia",
        email: "maria@example.com",
        password: "password",
        teaching: [
            { id: "201", name: "Conversational Spanish", category: "Language" }
        ],
        learning: [
            { id: "202", name: "Python for Data Science", category: "Development" }
        ]
    },
    {
        id: "3",
        name: "John Camera",
        email: "john@example.com",
        password: "password",
        teaching: [
            { id: "301", name: "Digital Photography Basics", category: "Art" }
        ],
        learning: [
            { id: "302", name: "Public Speaking Mastery", category: "Lifestyle" }
        ]
    }
];

export function readJSON(file: string) {
    const filePath = file === 'users' ? USERS_FILE : REQUESTS_FILE;
    if (!fs.existsSync(filePath)) {
        if (file === 'users') {
            writeJSON('users', SEED_USERS);
            return SEED_USERS;
        }
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export function writeJSON(file: string, data: any) {
    const filePath = file === 'users' ? USERS_FILE : REQUESTS_FILE;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
