import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { User } from '@/types';

export async function GET() {
    const users = readJSON('users');
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const userData = await request.json();
    const users = readJSON('users');

    // Check if user exists (update) or new (create)
    const existingIndex = users.findIndex((u: User) => u.id === userData.id);

    let updatedUsers;
    if (existingIndex > -1) {
        users[existingIndex] = { ...users[existingIndex], ...userData };
        updatedUsers = users;
    } else {
        updatedUsers = [...users, userData];
    }

    writeJSON('users', updatedUsers);
    return NextResponse.json({ success: true, user: userData });
}
