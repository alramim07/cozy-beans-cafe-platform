// A single menu item card used on the Menu and Home pages
export default function MenuItemCard({ item }) {
  return (
    <article className="card reveal" role="article">
      <div className="card__image">
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--cream-200), var(--cream-300))' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--brown-300)' }} aria-hidden="true">
              <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
        )}
      </div>
      <div className="card__body">
        {item.category && (
          <span className="card__category">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
        )}
        <h3 className="card__title">{item.name}</h3>
        <p className="card__desc">{item.description}</p>
        <div className="card__footer">
          <span className="card__price">${item.price.toFixed(2)}</span>
          {item.popular && (
            <span className="card__badge badge badge--popular">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Popular
            </span>
          )}
        </div>
      </div>
    </article>
  );
}