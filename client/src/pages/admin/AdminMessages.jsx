import { useState, useEffect } from 'react';
import api from '../../api.js';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch {
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (message) => {
    setUpdatingId(message._id);
    try {
      const { data } = await api.patch(`/contact/${message._id}`, { isRead: !message.isRead });
      setMessages(messages.map(m => m._id === message._id ? data : m));
      setSuccess(data.isRead ? 'Marked as read.' : 'Marked as unread.');
    } catch {
      setError('Update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      setSuccess('Message deleted.');
    } catch {
      setError('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="admin__loading"><div className="spinner" /></div>;

  return (
    <div className="admin-messages">
      <h2>Messages</h2>

      {error && <div className="form__error form__error--global">{error}</div>}
      {success && <div className="form__success form__success--global">{success}</div>}

      {messages.length === 0 ? (
        <div className="admin__empty">No messages yet.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Preview</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg._id} className={msg.isRead ? '' : 'admin-table__row--unread'}>
                  <td className="admin-table__name">{msg.name}</td>
                  <td>{msg.email}</td>
                  <td className="admin-table__preview">{msg.message.slice(0, 80)}{msg.message.length > 80 ? '…' : ''}</td>
                  <td>
                    <span className={`badge ${msg.isRead ? 'badge--read' : 'badge--unread'}`}>
                      {msg.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td className="admin-table__actions">
                    <button
                      className={`btn btn--small ${msg.isRead ? 'btn--secondary' : 'btn--primary'}`}
                      onClick={() => toggleRead(msg)}
                      disabled={updatingId === msg._id}
                    >
                      {updatingId === msg._id ? '…' : (msg.isRead ? 'Mark Unread' : 'Mark Read')}
                    </button>
                    <button
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(msg._id)}
                      disabled={deletingId === msg._id}
                    >
                      {deletingId === msg._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}