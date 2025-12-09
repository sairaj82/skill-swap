import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { ConnectionRequest } from '@/context/ConnectionsContext';

export async function GET(request: Request) {
    const requests = readJSON('requests');
    return NextResponse.json(requests);
}

export async function POST(request: Request) {
    const newRequest = await request.json();
    const requests = readJSON('requests');

    // Prevent duplicates check could go here, but context handles it too
    requests.push(newRequest);
    writeJSON('requests', requests);

    return NextResponse.json({ success: true, request: newRequest });
}

export async function PUT(request: Request) {
    const { requestId, status } = await request.json();
    const requests = readJSON('requests');

    const index = requests.findIndex((r: ConnectionRequest) => r.id === requestId);
    if (index > -1) {
        requests[index].status = status;
        writeJSON('requests', requests);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
}
