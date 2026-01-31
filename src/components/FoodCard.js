"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FoodCard({ food, index }) {
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=800'; // High-quality healthy food fallback
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="food-card"
    >
      <div className="card-image-wrap">
        <img
          src={food.image}
          alt={food.name}
          className="card-image"
          onError={handleImageError}
        />
        <span className="card-category">{food.category}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{food.name}</h3>
        <p className="card-description">{food.description}</p>
        <Link href={`/food/${food.id}`} className="card-link">
          Read More <ArrowRight size={18} />
        </Link>
      </div>

      <style jsx>{`
        .food-card {
          background: var(--card-bg);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .food-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .card-image-wrap {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .food-card:hover .card-image {
          transform: scale(1.1);
        }

        .card-category {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05rem;
          backdrop-filter: blur(5px);
        }

        .card-content {
          padding: 2rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }

        .card-description {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          flex-grow: 1;
        }

        .card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--primary);
          transition: gap 0.3s ease;
        }

        .card-link:hover {
          gap: 0.75rem;
        }
      `}</style>
    </motion.div>
  );
}
