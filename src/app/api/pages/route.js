import { NextResponse } from 'next/server';
import { getPages, savePages } from '@/data/dbHelper';

export async function GET(request) {
    try {
        const pages = getPages();
        return NextResponse.json(pages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, content } = body;

        if (!id || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const pages = getPages();
        if (!pages[id]) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        pages[id].content = content;
        // Optionally update title/subtitle if provided, but for now just content
        if (body.title) pages[id].title = body.title;
        if (body.subtitle) pages[id].subtitle = body.subtitle;

        savePages(pages);

        return NextResponse.json(pages[id]);
    } catch (error) {
        console.error('Error updating page:', error);
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}
