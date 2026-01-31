import { NextResponse } from 'next/server';
import { getFoods, saveFoods } from '@/data/dbHelper';

export async function GET() {
    try {
        const foods = getFoods();
        return NextResponse.json(foods);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const newFood = await request.json();
        const foods = getFoods();

        // Basic validation/ID generation
        if (!newFood.id) {
            newFood.id = newFood.name.toLowerCase().replace(/\s+/g, '-');
        }

        foods.push(newFood);
        saveFoods(foods);

        return NextResponse.json(newFood, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create food' }, { status: 500 });
    }
}
