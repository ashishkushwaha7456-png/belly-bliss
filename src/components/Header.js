"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Superfoods', href: '/#foods' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <Link href="/" className="logo">
          <Heart className="logo-icon" fill="currentColor" />
          <span>Belly Bliss</span>
        </Link>

        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="nav-link">
              {link.name}
            </Link>
          ))}
        </nav>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          background: transparent;
          padding: 1.5rem 0;
        }

        .header.scrolled {
          background: var(--header-bg);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--primary);
        }

        .logo-icon {
          width: 2rem;
          height: 2rem;
        }

        .desktop-nav {
          display: flex;
          gap: 2.5rem;
        }

        .nav-link {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--foreground);
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-link:after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link:hover:after {
          width: 100%;
        }

        .mobile-menu-btn {
          display: none;
          color: var(--foreground);
        }

        .mobile-nav {
          display: none;
          background: var(--background);
          padding: 2rem;
          flex-direction: column;
          gap: 1.5rem;
          border-bottom: 1px solid var(--primary-light);
        }

        .mobile-nav-link {
          font-size: 1.25rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-nav {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
