import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/menu', label: 'Menu' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu state

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={() => setOpen(false)}>
          Olive <span>&amp;</span> Oak
        </Link>

        {/* Desktop links */}
        <nav className="navbar__links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger button (mobile only) */}
        <button
          className="navbar__burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={open ? 'bar bar--open' : 'bar'} />
          <span className={open ? 'bar bar--open' : 'bar'} />
          <span className={open ? 'bar bar--open' : 'bar'} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="navbar__mobile">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}