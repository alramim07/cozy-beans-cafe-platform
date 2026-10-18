import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    popularItems: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get('/menu').then(r => r.data.length),
      api.get('/menu/popular').then(r => r.data.length),
      api.get('/contact').then(r => r.data.filter(m => !m.isRead).length),
    ])
      .then(([totalItems, popularItems, unreadMessages]) => {
        if (!cancelled) setStats({ totalItems, popularItems, unreadMessages });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load dashboard data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="admin__loading"><div className="spinner" /></div>;
  if (error) return <div className="admin__error">{error}</div>;

  const statCards = [
    { label: 'Total Menu Items', value: stats.totalItems, icon: '🍽️', link: '/admin/menu' },
    { label: 'Popular Items', value: stats.popularItems, icon: '⭐', link: '/admin/menu' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: '💬', link: '/admin/messages' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link} className="stat-card">
            <span className="stat-card__icon">{stat.icon}</span>
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
          <Link to="/admin/menu" className="btn btn--primary">Add Menu Item</Link>
          <Link to="/admin/messages" className="btn btn--secondary">View Messages</Link>
        </div>
      </section>
    </div>
  );
}