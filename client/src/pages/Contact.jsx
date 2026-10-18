import ContactForm from '../components/ContactForm.jsx';

const cafe = {
  phone: '+1 (555) 123-4567',
  email: 'hello@oliveandoak.cafe',
  address: '123 Main Street, Downtown',
  hours: 'Mon–Fri 7 AM–8 PM · Sat–Sun 8 AM–9 PM',
  mapSrc: 'https://www.google.com/maps?q=123+Main+Street+Downtown&output=embed',
};

export default function Contact() {
  return (
    <div className="section">
      <div className="container">
        <header className="section__header reveal">
          <span className="eyebrow">Get In Touch</span>
          <h2 className="section__title">Contact Us</h2>
          <p className="section__subtitle reveal reveal--delay-1">
            Questions, feedback, or just want to say hi? We'd love to hear from you.
          </p>
        </header>

        <div className="contact__grid reveal reveal--delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left: contact form */}
          <div className="admin-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Send a Message</h3>
            <ContactForm />
          </div>

          {/* Right: contact details + map */}
          <aside>
            <div className="admin-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Visit Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <a href={`tel:${cafe.phone.replace(/\D/g, '')}`} className="footer__contact-item" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--sage-500)' }} aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>{cafe.phone}</span>
                </a>
                <a href={`mailto:${cafe.email}`} className="footer__contact-item" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--sage-500)' }} aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>{cafe.email}</span>
                </a>
                <address className="footer__contact-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontStyle: 'normal', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--sage-500)', flexShrink: 0, marginTop: '0.125rem' }} aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{cafe.address}</span>
                </address>
                <div className="footer__contact-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--sage-500)' }} aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{cafe.hours}</span>
                </div>
              </div>
            </div>

            <div className="admin-card map" style={{ padding: 0, minHeight: '300px' }}>
              <iframe
                title="Olive & Oak Café location"
                src={cafe.mapSrc}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 'var(--radius-xl)', display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}