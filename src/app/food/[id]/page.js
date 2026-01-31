import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { getFoods } from '@/data/dbHelper';
import FoodDetail from '@/components/FoodDetail';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const foods = getFoods();
  const food = foods.find((f) => f.id === id);

  if (!food) {
    return {
      title: 'Food Not Found',
    };
  }

  return {
    title: `${food.name} Health Benefits | Belly Bliss`,
    description: food.description,
    openGraph: {
      title: `${food.name} - Superfood Benefits`,
      description: food.longDescription.substring(0, 160) + '...',
      images: [food.image],
    },
  };
}

export default async function FoodPage({ params }) {
  const { id } = await params;
  const foods = getFoods();
  const food = foods.find((f) => f.id === id);

  if (!food) {
    notFound();
  }

  return (
    <main>
      <Header />
      <FoodDetail food={food} />
      <Footer />
    </main>
  );
}
