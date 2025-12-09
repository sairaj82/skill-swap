import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/db';
import { User } from '@/types';

export async function POST(request: Request) {
    const { email, password } = await request.json();
    const users = readJSON('users');

    const user = users.find((u: User) => u.email === email && u.password === password);

    if (user) {
        return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}
