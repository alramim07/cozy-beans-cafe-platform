import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> ) },
  { path: '/admin/menu', label: 'Menu', icon: ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M7 10h10"/><path d="M12 3.511V6.5"/><path d="M16 6.511V9.5"/><path d="M8 10V6.5"/><path d="M7 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/></svg> ) },
  { path: '/admin/messages', label: 'Messages', icon: ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> ) },
];

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Page title for the header, based on the current route
  const pageTitles = {
    '/admin': 'Dashboard',
    '/admin/menu': 'Menu Management',
    '/admin/messages': 'Messages',
    '/admin/settings': 'Site Settings',
    '/admin/about': 'About Page',
  };
  const pageTitle = pageTitles[location.pathname] || 'Admin';

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
    setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" role="navigation" aria-label="Admin navigation">
        <div className="admin-sidebar__header">
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '600', color: 'var(--white)' }}>
              Olive & Oak <span style={{ color: 'var(--gold-400)' }}>Admin</span>
            </span>
          </Link>
        </div>
        <nav className="admin-nav">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'admin-nav__item admin-nav__item--active' : 'admin-nav__item'}
              onClick={closeSidebar}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p className="admin-user">Logged in as <strong>{admin?.email}</strong></p>
          <button className="btn btn--ghost admin-logout" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(255,255,255,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button
            className="admin-header__burger"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {sidebarOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          <h1 className="admin-header__title">{pageTitle}</h1>
        </header>
        <div className="admin-content"><Outlet /></div>
      </main>

      {/* Mobile sidebar overlay */}
      <div
        className={`admin-overlay ${sidebarOpen ? 'admin-overlay--open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
    </div>
  );
}