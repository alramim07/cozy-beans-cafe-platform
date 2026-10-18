import ContactForm from '../components/ContactForm.jsx';

// Café contact details (keep in one place)
const cafe = {
  phone: '+1 (555) 123-4567',
  email: 'hello@oliveandoak.cafe',
  address: '123 Main Street, Downtown',
  hours: 'Mon–Fri 7 AM–8 PM · Sat–Sun 8 AM–9 PM',
  // Google Maps embed (search-based embed, no API key needed)
  mapSrc:
    'https://www.google.com/maps?q=123+Main+Street+Downtown&output=embed',
};

export default function Contact() {
  return (
    <div className="section container">
      <h2 className="section__title fade-in">Contact Us</h2>
      <p className="section__subtitle fade-in">
        Questions, feedback, or just want to say hi? We'd love to hear from you.
      </p>

      <div className="contact__grid">
        {/* Left: contact form */}
        <div className="contact__form fade-in">
          <ContactForm />
        </div>

        {/* Right: contact details + map */}
        <aside className="contact__info fade-in">
          <div className="info-card">
            <h3>Get in Touch</h3>
            <p>
              <strong>Phone:</strong> {cafe.phone}
            </p>
            <p>
              <strong>Email:</strong> {cafe.email}
            </p>
            <p>
              <strong>Address:</strong> {cafe.address}
            </p>
            <p>
              <strong>Hours:</strong> {cafe.hours}
            </p>
          </div>

          <div className="info-card">
            <h3>Find Us</h3>
            <div className="map">
              <iframe
                title="Olive & Oak Café location"
                src={cafe.mapSrc}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}