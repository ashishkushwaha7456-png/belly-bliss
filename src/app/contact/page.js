"use client"

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus({ loading: false, success: true, error: null });
        e.target.reset();
      } else {
        const error = await res.json();
        setStatus({ loading: false, success: false, error: error.error || 'Failed to send' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Network error' });
    }
  };

  return (
    <main>
      <Header />

      <div className="page-header">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Reach out to Ashish Kumar with any questions or feedback about Belly Bliss.</p>
        </div>
      </div>

      <section className="container section-padding">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>Fill out the form or use our contact details to get in touch directly.</p>

            <div className="info-items">
              <div className="info-item">
                <Mail className="info-icon" />
                <div>
                  <strong>Email Us</strong>
                  <p>ashishkushwaha7456@gmail.com</p>
                </div>
              </div>
              <div className="info-item">
                <Phone className="info-icon" />
                <div>
                  <strong>Call Us</strong>
                  <p>+91 7417886033</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" />
                <div>
                  <strong>Our Office</strong>
                  <p>Wellness Center, Lucknow, India</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Ashish Kumar" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="ashishkushwaha7456@gmail.com" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" rows="5" placeholder="How can we help you?" required></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={status.loading}>
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>
            {status.success && <p className="success-msg">Message sent successfully! We'll get back to you soon.</p>}
            {status.error && <p className="error-msg">{status.error}</p>}
          </form>
        </div>
      </section>

      <Footer />
      <style jsx>{`
        .success-msg { color: #2ecc71; margin-top: 1rem; font-weight: 600; }
        .error-msg { color: #e74c3c; margin-top: 1rem; font-weight: 600; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </main>
  );
}
