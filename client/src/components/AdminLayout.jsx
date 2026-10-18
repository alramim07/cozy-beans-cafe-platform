import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/menu', label: 'Menu', icon: '🍽️' },
  { path: '/admin/messages', label: 'Messages', icon: '💬' },
];

export default function AdminLayout({ children }) {
  const { logout, admin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2>Olive & Oak <span>Admin</span></h2>
        </div>
        <nav className="admin-nav">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'admin-nav__item admin-nav__item--active' : 'admin-nav__item'}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p className="admin-user">Logged in as <strong>{admin?.email}</strong></p>
          <button className="btn btn--secondary admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header__title">{document.title.replace(' - Olive & Oak Admin', '')}</h1>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}