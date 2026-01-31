"use client"

import Link from 'next/link';
import { Heart, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link href="/" className="logo">
            <Heart className="logo-icon" fill="currentColor" />
            <span>Belly Bliss</span>
          </Link>
          <p className="footer-tagline">
            Empowering your health through nature's most powerful superfoods.
          </p>

        </div>

        <div className="footer-links">
          <div className="link-group">
            <h3>Website</h3>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="link-group">
            <h3>Legal</h3>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
            {/* <Link href="/admin">Admin Dashboard</Link> */}
          </div>
          <div className="link-group">
            <h3>Get In Touch</h3>
            <a href="mailto:ashishkushwaha7456@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> ashishkushwaha7456@gmail.com
            </a>
            <a href="tel:7417886033" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} /> 7417886033
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Belly Bliss. All rights reserved.</p>
          <p>Your guide to the world's healthiest foods.</p>
        </div>
        <div className="medical-disclaimer">
          <p><strong>Medical Disclaimer:</strong> The information provided on Belly Bliss is for educational and informational purposes only and is not intended as medical advice. Always consult with a qualified healthcare professional before making any significant changes to your diet or health regimen.</p>
        </div>
        <div className="footer-disclosure">
          <p>Belly Bliss is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--primary-light);
          padding: 5rem 0 2rem;
          margin-top: 5rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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

        .footer-tagline {
          color: var(--text-muted);
          max-width: 300px;
        }



        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .link-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .link-group h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-sans);
          color: var(--primary);
        }

        .link-group a {
          color: var(--text-muted);
          transition: color 0.3s ease;
        }

        .link-group a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          gap: 2rem;
          flex-wrap: wrap; /* Ensure wrapping on smaller screens */
        }

        .footer-disclosure {
           flex-basis: 100%;
           text-align: center;
           font-size: 0.75rem;
           opacity: 0.8;
           margin-top: 1rem;
        }

        .footer-copyright {
          min-width: 250px;
        }

        .medical-disclaimer {
          max-width: 600px;
          text-align: right;
          opacity: 0.7;
          line-height: 1.4;
        }

        @media (max-width: 968px) {
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }
          .medical-disclaimer {
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .footer-links {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          .link-group a {
             justify-content: center;
          }
        }
      `}</style>
    </footer >
  );
}
