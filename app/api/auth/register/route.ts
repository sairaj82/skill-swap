import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { User } from '@/types';

export async function POST(request: Request) {
    const { name, email, password } = await request.json();
    const users = readJSON('users');

    if (users.find((u: User) => u.email === email)) {
        return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password, // In real app, hash this
        teaching: [],
        learning: [
            {
                id: `skill-${Date.now()}`,
                name: "Community Member",
                category: "Lifestyle"
            }
        ]
    };

    users.push(newUser);
    writeJSON('users', users);

    return NextResponse.json({ success: true, user: newUser });
}
