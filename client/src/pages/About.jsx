const values = [
  {
    title: 'Fresh Ingredients',
    text: 'We source produce daily from local farms and prepare everything from scratch each morning.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
        <path d="M8 14v7M16 14v7M12 10v10" />
      </svg>
    ),
  },
  {
    title: 'Community',
    text: 'A warm, welcoming space where students, neighbors, and friends can gather and connect.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Comfort',
    text: 'From the coffee to the chairs, everything is chosen so you feel right at home.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
        <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5" />
        <path d="M7 16v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
      </svg>
    ),
  },
  {
    title: 'Sustainability',
    text: 'Compostable packaging, fair-trade coffee, and a small footprint we work hard to keep smaller.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" x2="12" y1="22.08" y2="12.01" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <>
      <div className="section">
      <div className="container">
        {/* Story Section */}
        <header className="section__header reveal">
          <span className="eyebrow">Our Story</span>
          <h2 className="section__title">Where It All Began</h2>
          <p className="section__subtitle reveal reveal--delay-1">
            A corner shop with one espresso machine and a big idea.
          </p>
        </header>

        <div className="grid grid--values" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <article className="reveal about-story" style={{ gridColumn: '1 / -1' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--terracotta-500)' }}>Since 2020</span>
              <h3 className="section__title" style={{ textAlign: 'left', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1.5rem' }}>
                Olive & Oak started as a small corner shop with one espresso machine and a big idea.
              </h3>
              <p className="lead" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                The name comes from the two trees outside our first storefront — olive for the food we love to cook, oak for the sturdy community we wanted to build.
              </p>
              <p className="lead" style={{ textAlign: 'left' }}>
                Today we're still family-run, still making everything fresh from scratch, and still happy to see you walk through the door. Every dish tells a story of local farmers, careful preparation, and the simple joy of sharing a good meal.
              </p>
            </div>
            <div style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'linear-gradient(135deg, var(--cream-200), var(--cream-300))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--brown-300)' }} aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" x2="12" y1="22.08" y2="12.01" />
              </svg>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div className="section section--alt">
      <div className="container">
        <header className="section__header reveal">
          <span className="eyebrow">Our Philosophy</span>
          <h2 className="section__title">What We Believe In</h2>
          <p className="section__subtitle reveal reveal--delay-1">
            Four principles that guide everything we do.
          </p>
        </header>

        <div className="grid grid--values" role="list">
          {values.map((v, index) => (
            <article key={v.title} className="value-card reveal reveal--delay-1" role="listitem" style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="value-card__icon" aria-hidden="true">
                {v.icon}
              </div>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__text">{v.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}