// About page: our story + value cards
const values = [
  {
    title: 'Fresh Ingredients',
    text: 'We source produce daily from local farms and prepare everything from scratch each morning.',
  },
  {
    title: 'Community',
    text: 'A warm, welcoming space where students, neighbors, and friends can gather and connect.',
  },
  {
    title: 'Comfort',
    text: 'From the coffee to the chairs, everything is chosen so you feel right at home.',
  },
  {
    title: 'Sustainability',
    text: 'Compostable packaging, fair-trade coffee, and a small footprint we work hard to keep smaller.',
  },
];

export default function About() {
  return (
    <div className="section container">
      <h2 className="section__title fade-in">Our Story</h2>
      <p className="about__story fade-in">
        Olive &amp; Oak Café started in 2020 as a small corner shop with one espresso
        machine and a big idea: serve honest, fresh food in a place that feels like home.
        The name comes from the two trees outside our first storefront — olive for the
        food we love to cook, oak for the sturdy community we wanted to build. Today we
        are still family-run, still making everything fresh, and still happy to see you
        walk through the door.
      </p>

      <h2 className="section__title section__title--spaced fade-in">What We Believe In</h2>
      <div className="grid grid--values">
        {values.map((v) => (
          <article key={v.title} className="value-card fade-in">
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}