import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <span className="hero__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          Est. 2020 • Downtown
        </span>
        <h1 id="hero-title" className="hero__title">
          Fresh food, warm drinks, <span>friendly faces.</span>
        </h1>
        <p className="hero__text">
          A cozy neighborhood café serving hearty breakfasts, light lunches, and
          hand-crafted coffee — made fresh every day for students, workers, and families.
        </p>
        <div className="hero__cta">
          <Link to="/menu" className="btn btn--primary btn--lg">
            View Our Menu
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/contact" className="btn btn--secondary btn--lg">
            Reserve a Table
          </Link>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}