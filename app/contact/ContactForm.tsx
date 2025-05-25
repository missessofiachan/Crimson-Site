'use client';

import React, {
  useState,
  useCallback,
  useRef,
  FormEvent,
  ChangeEvent,
} from 'react';
import { toast } from 'react-hot-toast';
import styles from './ContactForm.module.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

type FieldProps = {
  id: keyof FormData;
  label: string;
  type?: 'text' | 'email';
  required?: boolean;
  rows?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string | null;
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
};

const FormField: React.FC<FieldProps> = ({
  id,
  label,
  type = 'text',
  required = false,
  rows,
  value,
  onChange,
  error,
  inputRef,
}) => {
  const isTextarea = id === 'message';
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          className={styles.textarea}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          ref={inputRef as React.Ref<HTMLInputElement>}
          className={styles.input}
        />
      )}

      {error && (
        <div id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default function ContactForm() {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Refs for focus-on-error
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    subject: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setData((prev) => ({ ...prev, [name]: value }));
      // clear field-specific error as user types
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrs: typeof errors = {};
    if (!data.name.trim()) newErrs.name = 'Name is required';
    if (!data.email.trim()) newErrs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrs.email = 'Email looks invalid';
    if (!data.message.trim()) newErrs.message = 'Message is required';
    setErrors(newErrs);

    // focus first invalid
    const firstError = (Object.keys(newErrs) as (keyof FormData)[])[0];
    if (firstError) refs[firstError].current?.focus();

    return Object.keys(newErrs).length === 0;
  }, [data, refs]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);
      setSuccess(false);

      try {
        // simulate API
        await new Promise((r) => setTimeout(r, 1000));
        setSuccess(true);
        toast.success('Message sent!');
        setData(initialData);
      } catch (err: any) {
        toast.error(err?.message || 'Submission failed');
      } finally {
        setLoading(false);
      }
    },
    [validate]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <h2 className={styles.subtitle}>We’d love to hear from you</h2>
      </div>

      {/* status message */}
      {success && (
        <div
          className={styles.success}
          role="status"
          aria-live="polite"
        >
          Thanks! We'll be in touch shortly.
        </div>
      )}
      {Object.values(errors).some(Boolean) && !success && (
        <div
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          Please fix the errors below.
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={success ? undefined : 'form-error'}
      >
        <FormField
          id="name"
          label="Name"
          required
          value={data.name}
          onChange={handleChange}
          error={errors.name}
          inputRef={refs.name}
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          required
          value={data.email}
          onChange={handleChange}
          error={errors.email}
          inputRef={refs.email}
        />

        <FormField
          id="subject"
          label="Subject"
          value={data.subject}
          onChange={handleChange}
          error={errors.subject}
          inputRef={refs.subject}
        />

        <FormField
          id="message"
          label="Message"
          required
          rows={5}
          value={data.message}
          onChange={handleChange}
          error={errors.message}
          inputRef={refs.message}
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
