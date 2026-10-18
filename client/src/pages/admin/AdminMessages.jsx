import { useState, useEffect } from 'react';
import api from '../../api.js';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try { const { data } = await api.get('/contact'); setMessages(data); }
    catch { setError('Failed to load messages.'); }
    finally { setLoading(false); }
  };

  const toggleRead = async (message) => {
    setUpdatingId(message._id);
    try {
      const { data } = await api.patch(`/contact/${message._id}`, { isRead: !message.isRead });
      setMessages(messages.map(m => m._id === message._id ? data : m));
      setSuccess(data.isRead ? 'Marked as read.' : 'Marked as unread.');
    } catch { setError('Update failed.'); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    setDeletingId(id);
    try { await api.delete(`/contact/${id}`); setMessages(messages.filter(m => m._id !== id)); setSuccess('Message deleted.'); }
    catch { setError('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  if (loading) return <div className="loading"><div className="loading__spinner" /></div>;

  return (
    <div className="admin-messages">
      <div className="admin-page__header">
        <h2>Messages</h2>
        <span className="badge badge--unread" style={{ fontSize: 'var(--fs-sm)', fontWeight: '500', textTransform: 'none' }}>
          {messages.filter(m => !m.isRead).length} unread
        </span>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}
      {success && <div className="alert alert--success" role="status">{success}</div>}

      {messages.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1.5rem' }} aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: '0.5rem' }}>No messages yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Customer messages will appear here.</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '160px' }}>Name</th>
                  <th style={{ width: '200px' }}>Email</th>
                  <th>Preview</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th style={{ width: '140px' }}>Received</th>
                  <th style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg._id} className={msg.isRead ? '' : 'admin-table__row--unread'}>
                    <td className="admin-table__name">{msg.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>{msg.email}</td>
                    <td className="admin-table__preview" style={{ maxWidth: '320px' }}>{msg.message.slice(0, 100)}{msg.message.length > 100 ? '…' : ''}</td>
                    <td>
                      <span className={`badge ${msg.isRead ? 'badge--read' : 'badge--unread'}`}>
                        {msg.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap' }}>
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="admin-table__actions">
                      <button
                        className={`btn btn--tertiary btn--sm ${msg.isRead ? 'btn--secondary' : 'btn--primary'}`}
                        onClick={() => toggleRead(msg)}
                        disabled={updatingId === msg._id}
                        aria-label={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {updatingId === msg._id ? (
                          <span className="loading__spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                        ) : msg.isRead ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M12 16v-4"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/></svg>
                        )}
                      </button>
                      <button
                        className="btn btn--tertiary btn--sm btn--danger"
                        onClick={() => handleDelete(msg._id)}
                        disabled={deletingId === msg._id}
                        aria-label="Delete message"
                      >
                        {deletingId === msg._id ? (
                          <span className="loading__spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}