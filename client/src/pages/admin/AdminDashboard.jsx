import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalItems: 0, popularItems: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get('/menu').then(r => r.data.length),
      api.get('/menu/popular').then(r => r.data.length),
      api.get('/contact').then(r => r.data.filter(m => !m.isRead).length),
    ])
      .then(([totalItems, popularItems, unreadMessages]) => { if (!cancelled) setStats({ totalItems, popularItems, unreadMessages }); })
      .catch(() => { if (!cancelled) setError('Could not load dashboard data.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="loading"><div className="loading__spinner" /></div>;
  if (error) return <div className="alert alert--error">{error}</div>;

  const statCards = [
    { label: 'Total Menu Items', value: stats.totalItems, icon: ( <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M7 10h10"/><path d="M12 3.511V6.5"/><path d="M16 6.511V9.5"/><path d="M8 10V6.5"/><path d="M7 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/></svg> ), link: '/admin/menu', color: 'var(--sage-500)', bg: 'var(--sage-100)' },
    { label: 'Popular Items', value: stats.popularItems, icon: ( <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ), link: '/admin/menu', color: 'var(--gold-500)', bg: 'var(--gold-300)' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: ( <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> ), link: '/admin/messages', color: 'var(--terracotta-500)', bg: '#FDE8DD' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link} className="stat-card">
            <span className="stat-card__icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</span>
            <div className="stat-card__info">
              <p className="stat-card__value">{stat.value}</p>
              <p className="stat-card__label">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

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
    </div>
  );
}