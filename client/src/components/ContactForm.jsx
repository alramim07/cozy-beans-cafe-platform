import { useState } from 'react';
import api from '../api.js';

const initialForm = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [feedback, setFeedback] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Keep track of what the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear the field error as soon as the user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  // Validate before sending
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
      setFeedback(
        err.response?.data?.error || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
        />
        {fieldErrors.name && <p className="form__error">{fieldErrors.name}</p>}
      </div>

      <div className="form__field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        {fieldErrors.email && <p className="form__error">{fieldErrors.email}</p>}
      </div>

      <div className="form__field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help?"
        />
        {fieldErrors.message && <p className="form__error">{fieldErrors.message}</p>}
      </div>

      <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>

      {/* Success / error feedback */}
      {status === 'success' && <p className="form__success">{feedback}</p>}
      {status === 'error' && <p className="form__error">{feedback}</p>}
    </form>
  );
}