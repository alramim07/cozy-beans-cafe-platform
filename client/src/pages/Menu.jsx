import { useEffect, useState } from 'react';
import MenuItemCard from '../components/MenuItemCard.jsx';
import api from '../api.js';

// The three groups shown on the page (desserts are shown with drinks)
const tabs = [
  { key: 'all', label: 'All' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'drinks-desserts', label: 'Drinks & Desserts' },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the full menu once
  useEffect(() => {
    let cancelled = false;
    api
      .get('/menu')
      .then((res) => {
        if (!cancelled) setItems(res.data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load the menu. Is the server running?');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter items based on the active tab
  const filtered = items.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'drinks-desserts') {
      return item.category === 'drinks' || item.category === 'desserts';
    }
    return item.category === activeTab;
  });

  return (
    <div className="section container">
      <h2 className="section__title fade-in">Our Menu</h2>
      <p className="section__subtitle fade-in">Made fresh daily, priced fairly.</p>

      {/* Category filter tabs */}
      <div className="tabs" role="tablist" aria-label="Menu categories">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            className={activeTab === t.key ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="state state--loading">Loading menu…</p>}
      {error && <p className="state state--error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="state">No items in this category yet.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid">
          {filtered.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}