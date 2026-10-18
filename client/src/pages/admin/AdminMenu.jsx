import { useState, useEffect } from 'react';
import api from '../../api.js';

const categories = ['breakfast', 'lunch', 'drinks', 'desserts'];

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'breakfast', popular: false, image: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try { const { data } = await api.get('/menu'); setItems(data); }
    catch { setError('Failed to load menu items.'); }
    finally { setLoading(false); }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.description.trim()) errors.description = 'Description is required.';
    if (!form.price || Number(form.price) < 0) errors.price = 'Valid price required.';
    if (!categories.includes(form.category)) errors.category = 'Select a category.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError(''); setSuccess('');
    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, { ...form, price: Number(form.price), popular: form.popular });
        setSuccess('Menu item updated.');
      } else {
        await api.post('/menu', { ...form, price: Number(form.price), popular: form.popular });
        setSuccess('Menu item added.');
      }
      setForm({ name: '', description: '', price: '', category: 'breakfast', popular: false, image: '' });
      setEditingItem(null); setShowForm(false); loadItems();
    } catch (err) { setError(err.response?.data?.error || 'Save failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item? This cannot be undone.')) return;
    setDeletingId(id);
    try { await api.delete(`/menu/${id}`); setSuccess('Menu item deleted.'); loadItems(); }
    catch { setError('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, popular: item.popular, image: item.image || '' });
    setShowForm(true); setFormErrors({});
  };

  const cancelForm = () => {
    setEditingItem(null); setShowForm(false);
    setForm({ name: '', description: '', price: '', category: 'breakfast', popular: false, image: '' });
    setFormErrors({});
  };

  if (loading) return <div className="loading"><div className="loading__spinner" /></div>;

  return (
    <div className="admin-menu">
      <div className="admin-page__header">
        <h2>Menu Management</h2>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditingItem(null); setForm({ name: '', description: '', price: '', category: 'breakfast', popular: false, image: '' }); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Menu Item
        </button>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}
      {success && <div className="alert alert--success" role="status">{success}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="admin-form admin-form--inline">
          <div className="admin-form__header">
            <h3>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
            <button type="button" className="btn btn--tertiary btn--sm" onClick={cancelForm} style={{ padding: '0.375rem', lineHeight: 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="form__field">
              <label htmlFor="name">Name *</label>
              <input id="name" name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Avocado Toast" />
              {formErrors.name && <p className="form__error">{formErrors.name}</p>}
            </div>
            <div className="form__field">
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description..." />
              {formErrors.description && <p className="form__error">{formErrors.description}</p>}
            </div>
            <div className="form__row">
              <div className="form__field">
                <label htmlFor="price">Price *</label>
                <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="8.50" />
                {formErrors.price && <p className="form__error">{formErrors.price}</p>}
              </div>
              <div className="form__field">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                {formErrors.category && <p className="form__error">{formErrors.category}</p>}
              </div>
            </div>
            <div className="form__field form__field--checkbox">
              <label>
                <input type="checkbox" checked={form.popular} onChange={e => setForm({...form, popular: e.target.checked})} />
                Mark as Popular
              </label>
            </div>
            <div className="form__field">
              <label htmlFor="image">Image URL (optional)</label>
              <input id="image" name="image" type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." />
              {form.image && <img src={form.image} alt="Preview" style={{ maxWidth: '150px', maxHeight: '100px', borderRadius: 'var(--radius-md)', marginTop: '0.5rem', border: '1px solid var(--border-light)' }} />}
            </div>
            <div className="form__actions">
              <button type="submit" className="btn btn--primary">{editingItem ? 'Update' : 'Add'}</button>
              <button type="button" className="btn btn--secondary" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Image</th>
                <th>Name</th>
                <th style={{ width: '140px' }}>Category</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Price</th>
                <th style={{ width: '100px' }}>Popular</th>
                <th style={{ width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className="admin-table__empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1rem' }} aria-hidden="true"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M7 10h10"/><path d="M12 3.511V6.5"/><path d="M16 6.511V9.5"/><path d="M8 10V6.5"/><path d="M7 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/></svg>
                  <p>No menu items yet</p>
                  <p style={{ fontSize: 'var(--fs-sm)', marginTop: '0.5rem' }}>Click "Add Menu Item" to get started.</p>
                </td></tr>
              ) : (
                items.map(item => (
                  <tr key={item._id}>
                    <td>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="admin-table__thumb" />
                      ) : (
                        <div style={{ width: '56px', height: '42px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--cream-200), var(--cream-300))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--brown-300)' }} aria-hidden="true"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><circle cx="12" cy="12" r="4"/></svg>
                        </div>
                      )}
                    </td>
                    <td className="admin-table__name">{item.name}</td>
                    <td><span className="badge badge--category">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span></td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--sage-600)', fontSize: 'var(--fs-lg)' }}>$${item.price.toFixed(2)}</td>
                    <td>
                      {item.popular ? (
                        <span className="badge badge--popular">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          Popular
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>—</span>
                      )}
                    </td>
                    <td className="admin-table__actions">
                      <button className="btn btn--tertiary btn--sm" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5"/></svg>
                      </button>
                      <button className="btn btn--tertiary btn--sm btn--danger" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} aria-label={`Delete ${item.name}`}>
                        {deletingId === item._id ? (
                          <span className="loading__spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}