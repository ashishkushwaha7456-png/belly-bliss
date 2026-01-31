"use client"

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="overlay"></div>
      </div>
      <div className="container hero-content">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-subtitle"
        >
          Nature's Ultimate Fuel
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-title"
        >
          Discover the World's <br />
          <span className="gradient-text">Healthiest Foods</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-desc"
        >
          From vibrant berries to nutrient-dense greens, explore the superfoods
          that will transform your well-being and longevity.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="hero-actions"
        >
          <a href="#foods" className="btn btn-primary">Start Exploring</a>
          <a href="/about" className="btn btn-secondary">Learn Our Story</a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="scroll-indicator"
      >
        <ChevronDown size={30} />
      </motion.div>

      <style jsx>{`
        .hero {
          height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
          padding-top: 80px;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000');
          background-size: cover;
          background-position: center;
          z-index: -1;
          transform: scale(1.1); /* Subtle zoom for depth */
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.95) 100%
          );
        }

        @media (prefers-color-scheme: dark) {
          .overlay {
            background: radial-gradient(
              circle at center,
              rgba(15, 23, 16, 0.6) 0%,
              rgba(15, 23, 16, 0.98) 100%
            );
          }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 900px;
        }

        .hero-subtitle {
          color: var(--primary);
          font-weight: 800;
          letter-spacing: 0.4rem;
          text-transform: uppercase;
          font-size: 0.8rem;
          display: block;
          margin-bottom: 2rem;
          opacity: 0.8;
        }

        .hero-title {
          font-size: clamp(3rem, 10vw, 5.5rem);
          line-height: 1;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--primary), #8bc34a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .hero-desc {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto 3.5rem;
          line-height: 1.6;
          font-weight: 300;
        }

        .hero-actions {
          display: flex;
          gap: 2rem;
          justify-content: center;
        }

        .btn {
          padding: 1.25rem 3rem;
          border-radius: 100px;
          font-weight: 700;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-block;
          font-size: 1.1rem;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 15px 35px rgba(45, 90, 39, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 45px rgba(45, 90, 39, 0.35);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.15);
          color: var(--foreground);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @media (prefers-color-scheme: dark) {
          .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
          }
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-5px);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          color: var(--primary);
          opacity: 0.4;
        }

        @media (max-width: 768px) {
          .hero-actions {
            flex-direction: column;
            gap: 1.25rem;
            padding: 0 2rem;
          }
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
