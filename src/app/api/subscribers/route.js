import { NextResponse } from 'next/server';
import { getSubscribers } from '@/data/dbHelper';

export async function GET(request) {
    try {
        const auth = request.headers.get('Authorization');
        if (auth !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscribers = getSubscribers();
        return NextResponse.json(subscribers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}
