import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';

// Category accent colors for the breakdown bars (frontend palette)
const categoryColors = {
  breakfast: 'linear-gradient(135deg, var(--gold-300), var(--gold-500))',
  lunch: 'linear-gradient(135deg, var(--sage-300), var(--sage-500))',
  drinks: 'linear-gradient(135deg, var(--brown-100), var(--brown-300))',
  desserts: 'linear-gradient(135deg, var(--terracotta-300), var(--terracotta-500))',
};

// First letter for the message avatar
const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get('/menu').then((r) => r.data),
      api.get('/menu/popular').then((r) => r.data),
      api.get('/contact').then((r) => r.data),
    ])
      .then(([menu, popular, messages]) => {
        if (cancelled) return;
        // Menu count per category (for the breakdown bars)
        const categories = ['breakfast', 'lunch', 'drinks', 'desserts'];
        const counts = {};
        categories.forEach((c) => (counts[c] = menu.filter((i) => i.category === c).length));
        setData({
          menu,
          popular,
          messages,
          counts,
          unread: messages.filter((m) => !m.isRead).length,
          recent: messages.slice(0, 4), // API returns newest first
        });
      })
      .catch(() => { if (!cancelled) setError('Could not load dashboard data.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="loading"><div className="loading__spinner" /></div>;
  if (error) return <div className="alert alert--error">{error}</div>;

  const { menu, popular, messages, counts, unread, recent } = data;
  const maxCount = Math.max(...Object.values(counts), 1);

  // Greeting depends on time of day; date shown in the welcome banner
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const statCards = [
    {
      label: 'Menu Items',
      value: menu.length,
      hint: `across ${Object.values(counts).filter((c) => c > 0).length} categories`,
      link: '/admin/menu',
      icon: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M7 10h10"/><path d="M12 3.5V6.5"/><path d="M16 6.5V9.5"/><path d="M8 10V6.5"/><path d="M7 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/></svg> ),
      tone: 'sage',
    },
    {
      label: 'Popular Items',
      value: popular.length,
      hint: 'featured on the home page',
      link: '/admin/menu',
      icon: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ),
      tone: 'gold',
    },
    {
      label: 'Unread Messages',
      value: unread,
      hint: unread > 0 ? `${unread} waiting for a reply` : 'all caught up ✓',
      link: '/admin/messages',
      icon: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> ),
      tone: 'terracotta',
    },
    {
      label: 'Total Messages',
      value: messages.length,
      hint: 'received via contact form',
      link: '/admin/messages',
      icon: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> ),
      tone: 'brown',
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* ---- Welcome banner ---- */}
      <section className="dash-welcome" aria-label="Welcome">
        <div className="dash-welcome__text">
          <p className="dash-welcome__eyebrow">{today}</p>
          <h2 className="dash-welcome__title">{greeting}, Admin 👋</h2>
          <p className="dash-welcome__subtitle">
            Here's what's happening at the café today — {menu.length} menu items live and{' '}
            {unread > 0 ? `${unread} unread message${unread > 1 ? 's' : ''} waiting` : 'no pending messages'}.
          </p>
        </div>
        <div className="dash-welcome__art" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
      </section>

      {/* ---- Stat cards ---- */}
      <div className="stats-grid">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link} className={`stat-card stat-card--${stat.tone}`}>
            <span className="stat-card__icon">{stat.icon}</span>
            <div className="stat-card__info">
              <p className="stat-card__value">{stat.value}</p>
              <p className="stat-card__label">{stat.label}</p>
              <p className="stat-card__hint">{stat.hint}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ---- Quick actions ---- */}
      <section className="admin-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/admin/menu" className="btn btn--primary btn--lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            Add Menu Item
          </Link>
          <Link to="/admin/messages" className="btn btn--secondary btn--lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            View Messages
          </Link>
        </div>
      </section>

      {/* ---- Menu breakdown + recent messages ---- */}
      <div className="dash-grid">
        <section className="dash-card" aria-labelledby="dash-cat-title">
          <header className="dash-card__header">
            <h3 className="dash-card__title" id="dash-cat-title">Menu by Category</h3>
            <Link to="/admin/menu" className="dash-card__link">Manage →</Link>
          </header>
          <div className="cat-bars">
            {Object.entries(counts).map(([cat, count]) => (
              <div key={cat} className="cat-bar">
                <div className="cat-bar__top">
                  <span className="cat-bar__name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <span className="cat-bar__count">{count} item{count !== 1 ? 's' : ''}</span>
                </div>
                <div className="cat-bar__track">
                  <div
                    className="cat-bar__fill"
                    style={{ width: `${(count / maxCount) * 100}%`, background: categoryColors[cat] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dash-card" aria-labelledby="dash-msg-title">
          <header className="dash-card__header">
            <h3 className="dash-card__title" id="dash-msg-title">Recent Messages</h3>
            <Link to="/admin/messages" className="dash-card__link">View all →</Link>
          </header>
          {recent.length === 0 ? (
            <div className="dash-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p>No messages yet</p>
              <span>Customer messages from the contact form will show up here.</span>
            </div>
          ) : (
            <ul className="dash-msgs">
              {recent.map((msg) => (
                <li key={msg._id} className={`dash-msg ${msg.isRead ? '' : 'dash-msg--unread'}`}>
                  <span className="dash-msg__avatar" aria-hidden="true">{initials(msg.name)}</span>
                  <div className="dash-msg__body">
                    <p className="dash-msg__name">
                      {msg.name}
                      {!msg.isRead && <span className="dash-msg__dot" title="Unread" />}
                    </p>
                    <p className="dash-msg__preview">{msg.message}</p>
                  </div>
                  <span className="dash-msg__time">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
