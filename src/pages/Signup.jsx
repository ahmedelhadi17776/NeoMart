import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const nameValid = useMemo(() => form.name.trim().length > 0, [form.name]);
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email]);
  const passwordValid = useMemo(() => form.password.length >= 3, [form.password]);
  const canSubmit = nameValid && emailValid && passwordValid && !submitting;

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const eObj = {};
    if (!nameValid) eObj.name = 'Enter your name';
    if (!emailValid) eObj.email = 'Enter a valid email';
    if (!passwordValid) eObj.password = 'Password must be at least 3 characters';
    setErrors(eObj);
    if (Object.keys(eObj).length) return;
    setSubmitting(true);
    setTimeout(() => {
      signup(form.name, form.email, form.password);
      setSubmitting(false);
      navigate('/');
    }, 600);
  }, [form, signup, navigate, nameValid, emailValid, passwordValid]);

  const handleSocial = useCallback((provider) => {
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      const name = provider === 'google' ? 'Google User' : 'GitHub User';
      const email = provider === 'google' ? 'user.google@example.com' : 'user.github@example.com';
      signup(name, email, 'oauth');
      setSubmitting(false);
      navigate('/');
    }, 600);
  }, [signup, navigate, submitting]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="card glass-card p-4 card-entry auth-card">
            <div className="text-center mb-3 auth-header">
              <div className="auth-icon mb-2"><i className="bi bi-rocket-takeoff"></i></div>
              <h2 className="gradient-text mb-1">Create account</h2>
              <small className="text-muted">Join FLUX and start exploring</small>
            </div>

            <div className="oauth-divider my-3"><span>or continue with</span></div>
            <div className="oauth-buttons d-grid gap-2">
              <button type="button" className="btn oauth-btn google" onClick={() => handleSocial('google')} disabled={submitting}>
                <i className="bi bi-google me-2"></i>
                Continue with Google
              </button>
              <button type="button" className="btn oauth-btn github" onClick={() => handleSocial('github')} disabled={submitting}>
                <i className="bi bi-github me-2"></i>
                Continue with GitHub
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="mb-3 auth-input-group">
                <span className="input-icon"><i className="bi bi-person"></i></span>
                <input
                  name="name"
                  className={`form-control ${form.name ? (nameValid ? 'is-valid' : 'is-invalid') : ''}`}
                  value={form.name}
                  onChange={onChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              </div>
              <div className="mb-3 auth-input-group">
                <span className="input-icon"><i className="bi bi-envelope"></i></span>
                <input
                  name="email"
                  className={`form-control ${form.email ? (emailValid ? 'is-valid' : 'is-invalid') : ''}`}
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
              </div>
              <div className="mb-3 auth-input-group">
                <span className="input-icon"><i className="bi bi-lock"></i></span>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${form.password ? (passwordValid ? 'is-valid' : 'is-invalid') : ''}`}
                  value={form.password}
                  onChange={onChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label="Toggle password visibility"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>
              <button className="btn btn-primary w-100 auth-submit" type="submit" disabled={!canSubmit}>
                {submitting ? <span className="loading me-2" style={{ width: 18, height: 18, borderWidth: 2 }}></span> : <i className="bi bi-person-plus me-2"></i>}
                Create account
              </button>
            </form>
            <div className="text-center mt-3">
              <small className="text-muted">Use any details. Emails ending with @admin.com become Admin.</small>
              <div className="mt-2">
                <Link to="/login" className="text-decoration-underline">Already have an account? Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
