import { useState, useEffect } from 'react';
import api from '../../api.js';

const defaultHours = [
  { day: 'Monday', open: '07:00', close: '20:00', isClosed: false },
  { day: 'Tuesday', open: '07:00', close: '20:00', isClosed: false },
  { day: 'Wednesday', open: '07:00', close: '20:00', isClosed: false },
  { day: 'Thursday', open: '07:00', close: '20:00', isClosed: false },
  { day: 'Friday', open: '07:00', close: '20:00', isClosed: false },
  { day: 'Saturday', open: '08:00', close: '21:00', isClosed: false },
  { day: 'Sunday', open: '08:00', close: '21:00', isClosed: false },
];

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    contact: {
      phone: '',
      email: '',
      address: '',
      googleMapsEmbedUrl: '',
    },
    openingHours: defaultHours,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setForm({
        contact: {
          phone: data.contact?.phone || '',
          email: data.contact?.email || '',
          address: data.contact?.address || '',
          googleMapsEmbedUrl: data.contact?.googleMapsEmbedUrl || '',
        },
        openingHours: data.openingHours?.length ? data.openingHours : defaultHours,
      });
    } catch {
      setError('Could not load settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleHourChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.openingHours];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, openingHours: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/settings', {
        contact: form.contact,
        openingHours: form.openingHours,
      });
      setSuccess('Contact information & location settings saved successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading"><div className="loading__spinner" /></div>;

  return (
    <div className="admin-settings">
      <div className="admin-page__header">
        <h2>Contact & Location Settings</h2>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}
      {success && <div className="alert alert--success" role="status">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form" noValidate>
        {/* --- Visit Us / Contact Details --- */}
        <section className="admin-form__section">
          <h3 className="admin-form__section-title">Visit Us Information</h3>
          <p className="text-muted" style={{ marginBottom: '1.25rem', fontSize: 'var(--fs-sm)' }}>
            These details appear in the "Visit Us" section of the Contact page and in the website footer.
          </p>

          <div className="form__field">
            <label htmlFor="address">Physical Address *</label>
            <input
              id="address"
              type="text"
              required
              value={form.contact.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="e.g., 123 Main Street, Downtown"
            />
          </div>

          <div className="form__row">
            <div className="form__field">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="text"
                required
                value={form.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>

            <div className="form__field">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                required
                value={form.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="e.g., hello@oliveandoak.cafe"
              />
            </div>
          </div>
        </section>

        {/* --- Google Map Location --- */}
        <section className="admin-form__section">
          <h3 className="admin-form__section-title">Google Maps Location</h3>
          <p className="text-muted" style={{ marginBottom: '1.25rem', fontSize: 'var(--fs-sm)' }}>
            Enter a Google Maps embed URL (starts with <code>https://www.google.com/maps/embed</code> or <code>https://maps.google.com</code>). If left blank, it will automatically search using your address above.
          </p>

          <div className="form__field">
            <label htmlFor="mapUrl">Google Maps Embed URL</label>
            <input
              id="mapUrl"
              type="url"
              value={form.contact.googleMapsEmbedUrl}
              onChange={(e) => handleContactChange('googleMapsEmbedUrl', e.target.value)}
              placeholder="https://www.google.com/maps?q=...&output=embed"
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--brown-700)' }}>
              Map Preview:
            </p>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)', minHeight: 220, background: 'var(--cream-100)' }}>
              <iframe
                title="Location Map Preview"
                src={
                  form.contact.googleMapsEmbedUrl ||
                  `https://www.google.com/maps?q=${encodeURIComponent(form.contact.address || 'Olive & Oak Cafe')}&output=embed`
                }
                width="100%"
                height="220"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* --- Opening Hours --- */}
        <section className="admin-form__section">
          <h3 className="admin-form__section-title">Opening Hours</h3>
          <p className="text-muted" style={{ marginBottom: '1.25rem', fontSize: 'var(--fs-sm)' }}>
            Configure working hours for each day of the week.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {form.openingHours.map((item, index) => (
              <div
                key={item.day}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 'var(--fs-sm)', color: 'var(--brown-900)' }}>
                  {item.day}
                </span>

                <div>
                  <input
                    type="time"
                    disabled={item.isClosed}
                    value={item.open}
                    onChange={(e) => handleHourChange(index, 'open', e.target.value)}
                    style={{ padding: '0.4rem 0.5rem', fontSize: 'var(--fs-sm)' }}
                  />
                </div>

                <div>
                  <input
                    type="time"
                    disabled={item.isClosed}
                    value={item.close}
                    onChange={(e) => handleHourChange(index, 'close', e.target.value)}
                    style={{ padding: '0.4rem 0.5rem', fontSize: 'var(--fs-sm)' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--fs-xs)', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={item.isClosed}
                    onChange={(e) => handleHourChange(index, 'isClosed', e.target.checked)}
                  />
                  Closed
                </label>
              </div>
            ))}
          </div>
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
