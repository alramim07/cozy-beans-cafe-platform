import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import api from '../api.js';

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/menu/popular')
      .then((res) => { if (!cancelled) setPopular(res.data); })
      .catch(() => { if (!cancelled) setError('Could not load popular items. Is the server running?'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="popular-title">
        <div className="container">
          <header className="section__header">
            <span className="eyebrow">Customer Favorites</span>
            <h2 id="popular-title" className="section__title reveal">Popular Food & Drinks</h2>
            <p className="section__subtitle reveal reveal--delay-1">
              The items our regulars keep coming back for.
            </p>
          </header>

          {loading && (
            <div className="state state--loading" role="status" aria-label="Loading popular items">
              <div className="state__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="63" strokeDashoffset="0" />
                </svg>
              </div>
              <p className="state__title">Loading favorites…</p>
            </div>
          )}

          {error && (
            <div className="state alert alert--error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
              <div>
                <p className="state__title">Unable to load</p>
                <p className="state__text">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && popular.length === 0 && (
            <div className="state">
              <div className="state__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <p className="state__title">No popular items yet</p>
              <p className="state__text">Check back soon for customer favorites!</p>
            </div>
          )}

          {!loading && !error && popular.length > 0 && (
            <div className="grid" role="list">
              {popular.map((item, index) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section--alt" aria-labelledby="cta-title">
        <div className="container">
          <div className="reveal" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow">Visit Us Today</span>
            <h2 id="cta-title" className="section__title" style={{ marginBottom: '1rem' }}>Ready for a Great Meal?</h2>
            <p className="lead reveal reveal--delay-1" style={{ marginBottom: '2rem' }}>
              Stop by for breakfast, lunch, or just a perfect cup of coffee. We can't wait to serve you.
            </p>
            <div className="reveal reveal--delay-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn--primary btn--lg">Explore Full Menu</Link>
              <Link to="/contact" className="btn btn--secondary btn--lg">Get Directions</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}