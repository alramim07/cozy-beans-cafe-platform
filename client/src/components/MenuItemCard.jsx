// A single menu item card used on the Menu and Home pages
export default function MenuItemCard({ item }) {
  // Show a friendly placeholder when there is no image
  const imageStyle = item.image
    ? { backgroundImage: `url(${item.image})` }
    : { backgroundColor: 'var(--brown-light)' };

  return (
    <article className="card fade-in">
      <div className="card__image" style={imageStyle} role="img" aria-label={item.name} />
      <div className="card__body">
        <div className="card__header">
          <h3 className="card__title">{item.name}</h3>
          <span className="card__price">${item.price.toFixed(2)}</span>
        </div>
        <p className="card__desc">{item.description}</p>
        {item.popular && <span className="card__badge">Popular</span>}
      </div>
    </article>
  );
}