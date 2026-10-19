import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

export default function Footer() {
  const [contact, setContact] = useState({
    phone: '+1 (555) 123-4567',
    email: 'hello@oliveandoak.cafe',
    address: '123 Main Street, Downtown',
    weekdayHours: 'Monday – Friday: 7:00 AM – 8:00 PM',
    weekendHours: 'Saturday – Sunday: 8:00 AM – 9:00 PM',
  });

  useEffect(() => {
    let cancelled = false;
    api
      .get('/settings')
      .then((res) => {
        if (cancelled || !res.data) return;
        const c = res.data.contact || {};
        const hours = res.data.openingHours || [];

        const to12h = (t) => {
          if (!t) return '';
          const [hh, mm] = t.split(':').map(Number);
          const suffix = hh >= 12 ? 'PM' : 'AM';
          const h12 = hh % 12 || 12;
          return mm === 0 ? `${h12} ${suffix}` : `${h12}:${mm < 10 ? '0' : ''}${mm} ${suffix}`;
        };

        const mon = hours.find((h) => h.day === 'Monday');
        const sat = hours.find((h) => h.day === 'Saturday');

        setContact((prev) => ({
          phone: c.phone || prev.phone,
          email: c.email || prev.email,
          address: c.address || prev.address,
          weekdayHours: mon
            ? `Monday – Friday: ${mon.isClosed ? 'Closed' : `${to12h(mon.open)} – ${to12h(mon.close)}`}`
            : prev.weekdayHours,
          weekendHours: sat
            ? `Saturday – Sunday: ${sat.isClosed ? 'Closed' : `${to12h(sat.open)} – ${to12h(sat.close)}`}`
            : prev.weekendHours,
        }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        {/* Brand + contact info */}
        <div className="footer__col footer__brand">
          <p className="footer__logo">
            Olive <span>&</span> Oak
          </p>
          <p className="footer__tagline">Fresh food, warm drinks, friendly faces.</p>
          <address className="footer__contact" style={{ fontStyle: 'normal' }}>
            <p className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {contact.address}
            </p>
            <p className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {contact.phone}
            </p>
            <p className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {contact.email}
            </p>
          </address>
        </div>

        {/* Opening hours */}
        <div className="footer__col">
          <h4 className="footer__title">Opening Hours</h4>
          <div className="footer__links">
            <p>{contact.weekdayHours}</p>
            <p>{contact.weekendHours}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer__col">
          <h4 className="footer__title">Quick Links</h4>
          <nav className="footer__links" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/about">Our Story</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/contact">Contact & Reservations</Link>
          </nav>
        </div>

        {/* Social media */}
        <div className="footer__col">
          <h4 className="footer__title">Follow Us</h4>
          <div className="footer__social" role="list" aria-label="Social media links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" role="listitem">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" role="listitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" role="listitem">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.308.727-7.818-8.94-7.598 8.65-3.31-.727 8.12-9.14L0 2.25h3.145l6.856 7.74 6.325-7.44z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Olive & Oak Café. All rights reserved.</p>
      </div>
    </footer>
  );
}