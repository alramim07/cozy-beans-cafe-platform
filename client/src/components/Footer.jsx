export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        {/* Brand + contact info */}
        <div className="footer__col">
          <h3 className="footer__logo">
            Olive <span>&amp;</span> Oak
          </h3>
          <p className="footer__tagline">Fresh food, warm drinks, friendly faces.</p>
          <p>123 Main Street, Downtown</p>
          <p>+1 (555) 123-4567</p>
          <p>hello@oliveandoak.cafe</p>
        </div>

        {/* Opening hours */}
        <div className="footer__col">
          <h4>Opening Hours</h4>
          <p>Mon – Fri: 7:00 AM – 8:00 PM</p>
          <p>Sat – Sun: 8:00 AM – 9:00 PM</p>
        </div>

        {/* Social media links */}
        <div className="footer__col">
          <h4>Follow Us</h4>
          <div className="footer__social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              Instagram
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X / Twitter">
              X / Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Olive &amp; Oak Café. All rights reserved.</p>
      </div>
    </footer>
  );
}