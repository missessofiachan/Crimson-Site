'use client';
import { useState } from 'react';
import styles from './ContactForm.module.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all required fields');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call - in a real app, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSuccess(true);
      
      // Note: In a real application, you would implement an actual API endpoint
      // to handle the form submission, similar to:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // if (!response.ok) throw new Error('Failed to submit form');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <h2 className={styles.subtitle}>We'd love to hear from you</h2>
      </div>

      {success && (
        <div className={styles.success}>
          Thank you for your message! We'll get back to you soon.
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            Name *
          </label>
          <input
            className={styles.input}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email *
          </label>
          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="subject">
            Subject
          </label>
          <input
            className={styles.input}
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="message">
            Message *
          </label>
          <textarea
            className={styles.textarea}
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button 
          className={styles.submitButton} 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
