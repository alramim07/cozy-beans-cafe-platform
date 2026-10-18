import { useEffect, useState } from 'react';
import MenuItemCard from '../components/MenuItemCard.jsx';
import api from '../api.js';

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'breakfast', label: 'Breakfast', icon: ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14a6 6 0 0 1 12 0v4H8v-4z"/></svg> ) },
  { key: 'lunch', label: 'Lunch', icon: ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><path d="M12 2v4M12 18v4"/></svg> ) },
  { key: 'drinks', label: 'Drinks', icon: ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M7 10h10"/><path d="M12 3.511V6.5"/><path d="M16 6.511V9.5"/><path d="M8 10V6.5"/><path d="M7 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/></svg> ) },
  { key: 'desserts', label: 'Desserts', icon: ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> ) },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/menu')
      .then((res) => { if (!cancelled) setItems(res.data); })
      .catch(() => { if (!cancelled) setError('Could not load the menu. Is the server running?'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = items.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'drinks') return item.category === 'drinks' || item.category === 'desserts';
    return item.category === activeTab;
  });

  return (
    <div className="section">
      <div className="container">
        <header className="section__header reveal">
          <span className="eyebrow">Our Offerings</span>
          <h2 className="section__title">Menu</h2>
          <p className="section__subtitle reveal reveal--delay-1">Made fresh daily, priced fairly.</p>
        </header>

        {/* Category filter tabs */}
        <div className="tabs reveal reveal--delay-1" role="tablist" aria-label="Menu categories">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              className={activeTab === t.key ? 'tab tab--active' : 'tab'}
              onClick={() => setActiveTab(t.key)}
            >
              {t.icon && <span style={{ display: 'inline-flex', marginRight: '0.5rem' }}>{t.icon}</span>}
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="state state--loading" role="status" aria-label="Loading menu">
            <div className="state__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="63" strokeDashoffset="0" />
              </svg>
            </div>
            <p className="state__title">Loading menu…</p>
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
              <p className="state__title">Unable to load menu</p>
              <p className="state__text">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state reveal">
            <div className="state__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <p className="state__title">No items in this category</p>
            <p className="state__text">Check back later or try another category.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid" role="list">
            {filtered.map((item, index) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}