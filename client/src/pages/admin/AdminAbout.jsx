import { useState, useEffect } from 'react';
import api from '../../api.js';

// Icons available for value cards (emoji fallback if no SVG provided)
const availableIcons = ['🌱', '🤝', '🛋️', '♻️', '☕', '🍃', '👨‍👩‍👧‍👦', '🏡', '🌿', '💚', '✨', '🌟'];

export default function AdminAbout() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    storyEyebrow: 'Our Story',
    storyHeading: 'Where It All Began',
    storySubheading: 'A corner shop with one espresso machine and a big idea.',
    storyText: '',
    storyImage: '',
    valueCards: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: content } = await api.get('/about');
      setData(content);
      // Ensure valueCards have unique IDs and orders
      const cards = [...(content.valueCards || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      setForm({
        storyEyebrow: content.storyEyebrow,
        storyHeading: content.storyHeading,
        storySubheading: content.storySubheading,
        storyText: content.storyText,
        storyImage: content.storyImage || '',
        valueCards: cards.map((c, i) => ({
          _id: c._id || `new-${Date.now()}-${i}`,
          icon: c.icon || '🌱',
          title: c.title,
          description: c.description,
          order: c.order || i,
        })),
      });
    } catch {
      setError('Could not load About content.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Only send valueCards with valid titles and descriptions
      const validCards = form.valueCards
        .filter((c) => c.title?.trim() && c.description?.trim())
        .map((c, i) => ({
          icon: c.icon,
          title: c.title.trim(),
          description: c.description.trim(),
          order: i,
        }));

      await api.put('/about', {
        storyEyebrow: form.storyEyebrow,
        storyHeading: form.storyHeading,
        storySubheading: form.storySubheading,
        storyText: form.storyText,
        storyImage: form.storyImage,
        valueCards: validCards,
      });

      setSuccess('About page content saved successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const addValueCard = () => {
    setForm({
      ...form,
      valueCards: [
        ...form.valueCards,
        { _id: `new-${Date.now()}`, icon: '🌱', title: '', description: '', order: form.valueCards.length },
      ],
    });
  };

  const removeValueCard = (id) => {
    setForm({
      ...form,
      valueCards: form.valueCards.filter((c) => c._id !== id).map((c, i) => ({ ...c, order: i })),
    });
  };

  const moveValueCard = (id, direction) => {
    const idx = form.valueCards.findIndex((c) => c._id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= form.valueCards.length) return;
    const newCards = [...form.valueCards];
    [newCards[idx], newCards[newIdx]] = [newCards[newIdx], newCards[idx]];
    setForm({
      ...form,
      valueCards: newCards.map((c, i) => ({ ...c, order: i })),
    });
  };

  if (loading) return <div className="loading"><div className="loading__spinner" /></div>;

  return (
    <div className="admin-about">
      <div className="admin-page__header">
        <h2>About Page Content</h2>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}
      {success && <div className="alert alert--success" role="status">{success}</div>}

      <form onSubmit={handleSave} className="admin-form" noValidate>
        {/* --- Story Section --- */}
        <section className="admin-form__section">
          <h3 className="admin-form__section-title">Story</h3>

          <div className="form__field">
            <label htmlFor="storyEyebrow">Eyebrow / Tag</label>
            <input
              id="storyEyebrow"
              value={form.storyEyebrow}
              onChange={(e) => setForm({ ...form, storyEyebrow: e.target.value })}
              placeholder="e.g., Our Story"
            />
          </div>

          <div className="form__field">
            <label htmlFor="storyHeading">Heading *</label>
            <input
              id="storyHeading"
              required
              value={form.storyHeading}
              onChange={(e) => setForm({ ...form, storyHeading: e.target.value })}
              placeholder="e.g., Where It All Began"
            />
          </div>

          <div className="form__field">
            <label htmlFor="storySubheading">Subheading</label>
            <input
              id="storySubheading"
              value={form.storySubheading}
              onChange={(e) => setForm({ ...form, storySubheading: e.target.value })}
              placeholder="Short tagline under the heading"
            />
          </div>

          <div className="form__field">
            <label htmlFor="storyText">Story Text *</label>
            <textarea
              id="storyText"
              required
              rows={6}
              value={form.storyText}
              onChange={(e) => setForm({ ...form, storyText: e.target.value })}
              placeholder="The full story... Use blank lines for paragraphs."
            />
          </div>

          <div className="form__field">
            <label htmlFor="storyImage">Story Image URL (optional)</label>
            <input
              id="storyImage"
              type="url"
              value={form.storyImage}
              onChange={(e) => setForm({ ...form, storyImage: e.target.value })}
              placeholder="https://..."
            />
            {form.storyImage && (
              <img
                src={form.storyImage}
                alt="Story preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '0.5rem',
                  border: '1px solid var(--border-light)',
                }}
              />
            )}
          </div>
        </section>

        {/* --- Value Cards Section --- */}
        <section className="admin-form__section">
          <header className="admin-form__section-header">
            <h3 className="admin-form__section-title">Value Cards</h3>
            <button type="button" className="btn btn--secondary btn--sm" onClick={addValueCard}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Add Value Card
            </button>
          </header>

          {form.valueCards.length === 0 ? (
            <p className="admin-form__empty">No value cards yet. Click "Add Value Card" to create one.</p>
          ) : (
            <div className="value-cards-list">
              {form.valueCards.map((card, idx) => (
                <article key={card._id} className="value-card-editor">
                  <div className="value-card-editor__header">
                    <span className="value-card-editor__number">{idx + 1}</span>
                    <div className="value-card-editor__actions">
                      <button
                        type="button"
                        className="btn btn--tertiary btn--sm"
                        onClick={() => moveValueCard(card._id, -1)}
                        disabled={idx === 0}
                        aria-label="Move up"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>
                      </button>
                      <button
                        type="button"
                        className="btn btn--tertiary btn--sm"
                        onClick={() => moveValueCard(card._id, 1)}
                        disabled={idx === form.valueCards.length - 1}
                        aria-label="Move down"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <button
                        type="button"
                        className="btn btn--tertiary btn--sm btn--danger"
                        onClick={() => removeValueCard(card._id)}
                        aria-label="Delete card"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                      </button>
                    </div>
                  </div>

                  <div className="value-card-editor__fields">
                    <div className="form__field form__field--icon">
                      <label>Icon</label>
                      <div className="icon-picker">
                        {availableIcons.map((ic) => (
                          <button
                            key={ic}
                            type="button"
                            className={`icon-picker__item ${card.icon === ic ? 'icon-picker__item--selected' : ''}`}
                            onClick={() => setForm({ ...form, valueCards: form.valueCards.map((c) => (c._id === card._id ? { ...c, icon: ic } : c)) })}
                            aria-label={ic}
                            aria-pressed={card.icon === ic}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form__field">
                      <label htmlFor={`title-${card._id}`}>Title *</label>
                      <input
                        id={`title-${card._id}`}
                        required
                        value={card.title}
                        onChange={(e) => setForm({ ...form, valueCards: form.valueCards.map((c) => (c._id === card._id ? { ...c, title: e.target.value } : c)) })}
                        placeholder="e.g., Fresh Ingredients"
                      />
                    </div>

                    <div className="form__field">
                      <label htmlFor={`desc-${card._id}`}>Description *</label>
                      <textarea
                        id={`desc-${card._id}`}
                        required
                        rows={3}
                        value={card.description}
                        onChange={(e) => setForm({ ...form, valueCards: form.valueCards.map((c) => (c._id === card._id ? { ...c, description: e.target.value } : c)) })}
                        placeholder="Short description for the card..."
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}