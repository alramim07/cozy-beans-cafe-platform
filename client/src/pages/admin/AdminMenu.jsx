import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'breakfast',
    popular: false,
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const categories = ['breakfast', 'lunch', 'drinks', 'desserts'];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data } = await api.get('/menu');
      setItems(data);
    } catch {
      setError('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
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

    setError('');
    setSuccess('');
    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, {
          ...form,
          price: Number(form.price),
          popular: form.popular,
        });
        setSuccess('Menu item updated.');
      } else {
        await api.post('/menu', {
          ...form,
          price: Number(form.price),
          popular: form.popular,
        });
        setSuccess('Menu item added.');
      }
      setForm({ name: '', description: '', price: '', category: 'breakfast', popular: false, image: '' });
      setEditingItem(null);
      setShowForm(false);
      loadItems();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/menu/${id}`);
      setSuccess('Menu item deleted.');
      loadItems();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      popular: item.popular,
      image: item.image || '',
    });
    setShowForm(true);
    setFormErrors({});
  };

  const cancelForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setForm({ name: '', description: '', price: '', category: 'breakfast', popular: false, image: '' });
    setFormErrors({});
  };

  if (loading) return <div className="admin__loading"><div className="spinner" /></div>;

  return (
    <div className="admin-menu">
      <div className="admin-page__header">
        <h2>Menu Management</h2>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditingItem(null); setForm({ name: '', description: '', price: '', category: 'breakfast', popular: false, image: '' }); }}>
          Add Menu Item
        </button>
      </div>

      {error && <div className="form__error form__error--global">{error}</div>}
      {success && <div className="form__success form__success--global">{success}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="admin-form-card fade-in">
          <h3>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
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
              {form.image && <img src={form.image} alt="Preview" className="form__image-preview" />}
            </div>
            <div className="form__actions">
              <button type="submit" className="btn btn--primary">{editingItem ? 'Update' : 'Add'}</button>
              <button type="button" className="btn btn--secondary" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Popular</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} className="admin-table__empty">No menu items yet. Click "Add Menu Item" to get started.</td></tr>
            ) : (
              items.map(item => (
                <tr key={item._id}>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="admin-table__thumb" />
                    ) : (
                      <span className="admin-table__no-image">—</span>
                    )}
                  </td>
                  <td className="admin-table__name">{item.name}</td>
                  <td><span className="badge badge--category">{item.category}</span></td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.popular ? '⭐ Yes' : 'No'}</td>
                  <td className="admin-table__actions">
                    <button className="btn btn--small btn--secondary" onClick={() => startEdit(item)}>Edit</button>
                    <button className="btn btn--small btn--danger" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id}>
                      {deletingId === item._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}