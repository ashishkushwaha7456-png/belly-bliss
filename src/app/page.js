"use client"

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/foods')
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(err => console.error('Failed to load foods', err));
  }, []);

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubscribe = async () => {
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        alert('Welcome to the community! Check your email soon for diet tips.');
        setEmail('');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <main>
      <Header />
      <Hero />

      <section id="foods" className="container section-padding">
        <div className="section-header">
          <span className="section-subtitle">The Collection</span>
          <h2 className="section-title">Essential Superfoods</h2>
          <p className="section-desc">
            Our curated guide to the most nutrient-dense foods on the planet.
            Science-backed benefits to help you thrive.
          </p>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search foods by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="foods-grid">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food, index) => (
              <FoodCard key={food.id} food={food} index={index} />
            ))
          ) : (
            <div className="no-results">
              <p>No superfoods found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        <style jsx>{`
          .search-container {
            max-width: 600px;
            margin: 0 auto 3rem;
          }
          .search-input {
            width: 100%;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            border: 2px solid #e2e8f0;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .search-input:focus {
            border-color: var(--primary);
            outline: none;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: var(--text-muted);
            background: #f8fafc;
            border-radius: 20px;
          }
        `}</style>
      </section>

      <section className="tips-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Wellness Guide</span>
            <h2 className="section-title">Healthy Living Tips</h2>
          </div>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-number">01</div>
              <h3>Eat the Rainbow</h3>
              <p>Incorporate a variety of colors in your diet to ensure a wide spectrum of phytonutrients and antioxidants.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">02</div>
              <h3>Whole Foods First</h3>
              <p>Prioritize minimally processed foods to maximize nutrient density and avoid hidden additives.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">03</div>
              <h3>Mindful Consumption</h3>
              <p>Listen to your body's hunger signals and enjoy your food slowly for better digestion and satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Join Our Wellness Community</h2>
              <p>Get weekly nutrition guides and superfood recipes delivered to your inbox.</p>
              <div className="cta-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="cta-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="cta-btn"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? 'Joining...' : 'Join Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main >
  );
}
