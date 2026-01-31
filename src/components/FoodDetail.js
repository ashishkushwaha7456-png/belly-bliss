'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Flame, Droplets, Wheat, Beef } from 'lucide-react';
import AdUnit from '@/components/AdUnit';

export default function FoodDetail({ food }) {
    return (
        <>
            <div className="food-hero">
                <div className="container food-hero-content">
                    <div className="hero-text">
                        <span className="category-tag">{food.category}</span>
                        <h1>{food.name}</h1>
                        <p className="lead">{food.description}</p>
                    </div>
                    <div className="hero-image-wrap">
                        <Image
                            src={food.image}
                            alt={food.name}
                            width={800}
                            height={600}
                            className="hero-image"
                            priority
                            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                        />
                    </div>
                </div>
            </div>

            <section className="container section-padding">
                <div className="food-details-grid">
                    <div className="details-main">
                        <h2>The Power of {food.name}</h2>
                        <p className="long-desc">{food.longDescription}</p>

                        <div className="benefits-section">
                            <h3>Key Health Benefits</h3>
                            <div className="benefits-grid">
                                {food.benefits.map((benefit, i) => (
                                    <div key={i} className="benefit-item">
                                        <CheckCircle2 className="benefit-icon" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {(food.amazonLink || food.flipkartLink) && (
                            <div className="affiliate-section">
                                <h3>Recommended Products</h3>
                                <p>We&apos;ve hand-picked the best quality sources for {food.name} to help you integrate it into your diet.</p>
                                <div className="affiliate-buttons">
                                    {food.amazonLink && (
                                        <a href={food.amazonLink} target="_blank" rel="noopener noreferrer" className="affiliate-btn amazon">
                                            Buy on Amazon
                                        </a>
                                    )}
                                    {food.flipkartLink && (
                                        <a href={food.flipkartLink} target="_blank" rel="noopener noreferrer" className="affiliate-btn flipkart">
                                            Buy on Flipkart
                                        </a>
                                    )}
                                </div>
                                <p className="affiliate-disclaimer">As an Amazon Associate, I earn from qualifying purchases.</p>
                            </div>
                        )}

                        <style jsx>{`
              .affiliate-section {
                margin-top: 3rem;
                padding: 2rem;
                background: #f8fafc;
                border-radius: 20px;
                border: 1px solid #e2e8f0;
              }
              .affiliate-section h3 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                color: var(--foreground);
              }
              .affiliate-section p {
                color: var(--text-muted);
                margin-bottom: 1.5rem;
              }
              .affiliate-disclaimer {
                margin-top: 1rem;
                font-size: 0.85rem;
                font-style: italic;
                opacity: 0.8;
                margin-bottom: 0 !important;
              }
              .affiliate-buttons {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
              }
              .affiliate-btn {
                padding: 1rem 2rem;
                border-radius: 12px;
                font-weight: 700;
                text-decoration: none;
                transition: transform 0.2s;
                display: inline-block;
              }
              .affiliate-btn:hover {
                transform: translateY(-2px);
              }
              .amazon {
                background: #FF9900;
                color: black;
              }
              .flipkart {
                background: #2874f0;
                color: white;
              }
            `}</style>
                    </div>

                    <aside className="details-sidebar">
                        <div className="nutrition-card">
                            <h3>Nutrition Facts</h3>
                            <p className="serving-size">Per 100g serving</p>

                            <div className="nutrition-stat">
                                <div className="stat-info">
                                    <Flame size={20} />
                                    <span>Calories</span>
                                </div>
                                <span className="stat-value">{food.calories} kcal</span>
                            </div>

                            <div className="nutrition-stat">
                                <div className="stat-info">
                                    <Beef size={20} />
                                    <span>Protein</span>
                                </div>
                                <span className="stat-value">{food.protein}</span>
                            </div>

                            <div className="nutrition-stat">
                                <div className="stat-info">
                                    <Wheat size={20} />
                                    <span>Carbohydrates</span>
                                </div>
                                <span className="stat-value">{food.carbs}</span>
                            </div>

                            <div className="nutrition-stat">
                                <div className="stat-info">
                                    <Droplets size={20} />
                                    <span>Healthy Fats</span>
                                </div>
                                <span className="stat-value">{food.fat}</span>
                            </div>

                            <div className="nutrition-disclaimer">
                                * Nutritional values are approximate and may vary by source.
                            </div>
                        </div>

                        <AdUnit slot="1234567890" />
                    </aside>
                </div>
            </section>
        </>
    );
}
