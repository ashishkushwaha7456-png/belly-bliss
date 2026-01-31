import { NextResponse } from 'next/server';
import { getFoods, saveFoods } from '@/data/dbHelper';

export async function GET(request, { params }) {
    const { id } = await params;
    const foods = getFoods();
    const food = foods.find(f => f.id === id);

    if (!food) {
        return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json(food);
}

export async function PUT(request, { params }) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const updatedFood = await request.json();
        const foods = getFoods();
        const index = foods.findIndex(f => f.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Food not found' }, { status: 404 });
        }

        foods[index] = { ...foods[index], ...updatedFood };
        saveFoods(foods);

        return NextResponse.json(foods[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const foods = getFoods();
        const filteredFoods = foods.filter(f => f.id !== id);

        if (foods.length === filteredFoods.length) {
            return NextResponse.json({ error: 'Food not found' }, { status: 404 });
        }

        saveFoods(filteredFoods);
        return NextResponse.json({ message: 'Food deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
    }
}
