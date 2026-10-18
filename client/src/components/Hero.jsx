import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Welcome to Olive &amp; Oak Café</p>
        <h1 className="hero__title">Fresh food, warm drinks, friendly faces.</h1>
        <p className="hero__text">
          A cozy neighborhood café serving hearty breakfasts, light lunches, and
          hand-crafted coffee — made fresh every day for students, workers, and families.
        </p>
        <Link to="/menu" className="btn btn--primary">
          View Menu
        </Link>
      </div>
    </section>
  );
}