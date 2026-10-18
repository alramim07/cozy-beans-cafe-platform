import { useState } from 'react';
import api from '../api.js';

const initialForm = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Please enter a valid email.';
    if (!form.message.trim()) errors.message = 'Message is required.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('sending');
    setFeedback('');
    try {
      const { data } = await api.post('/contact', form);
      setStatus('success');
      setFeedback(data.message || 'Thanks! Your message has been sent.');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setFeedback(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__field">
        <label htmlFor="name">Your Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          autoComplete="name"
        />
        {fieldErrors.name && <p className="form__error">{fieldErrors.name}</p>}
      </div>

      <div className="form__field">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          autoComplete="email"
        />
        {fieldErrors.email && <p className="form__error">{fieldErrors.email}</p>}
      </div>

      <div className="form__field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help you today?"
        />
        {fieldErrors.message && <p className="form__error">{fieldErrors.message}</p>}
      </div>

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? (
          <>
            <span className="loading__spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'var(--white)' }} />
            Sending…
          </>
        ) : 'Send Message'}
      </button>

      {status === 'success' && (
        <div className="alert alert--success" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>{feedback}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert--error" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          <span>{feedback}</span>
        </div>
      )}
    </form>
  );
}