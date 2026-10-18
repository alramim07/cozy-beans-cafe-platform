import { useEffect, useState } from 'react';
import Hero from '../components/Hero.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import api from '../api.js';

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch popular items when the page loads
  useEffect(() => {
    let cancelled = false; // avoids state updates after unmount
    api
      .get('/menu/popular')
      .then((res) => {
        if (!cancelled) setPopular(res.data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load popular items. Is the server running?');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Hero />

      <section className="section container">
        <h2 className="section__title fade-in">Popular Food &amp; Drinks</h2>
        <p className="section__subtitle fade-in">
          The items our regulars keep coming back for.
        </p>

        {loading && <p className="state state--loading">Loading…</p>}
        {error && <p className="state state--error">{error}</p>}

        {!loading && !error && (
          <div className="grid">
            {popular.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}