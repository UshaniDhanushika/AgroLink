import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Leaf, ArrowRight, Lock, Mail } from 'lucide-react';
import './AuthPages.css';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    try {
      // Mock login — replace with real API call when backend is ready
      await new Promise(res => setTimeout(res, 800));
      if (data.email === 'admin@agrolink.com' && data.password === 'password123') {
        login('mock-jwt-token', { id: '1', name: 'Admin User', email: data.email, role: 'ADMIN' });
        navigate(from, { replace: true });
      } else if (data.email === 'buyer@agrolink.com' && data.password === 'password123') {
        login('mock-jwt-token', { id: '2', name: 'Ravi Perera', email: data.email, role: 'BUYER' });
        navigate(from, { replace: true });
      } else if (data.email === 'seller@agrolink.com' && data.password === 'password123') {
        login('mock-jwt-token', { id: '3', name: 'Priya Nair', email: data.email, role: 'SELLER' });
        navigate(from, { replace: true });
      } else {
        setServerError('Invalid email or password. Try admin@agrolink.com / password123');
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Background elements */}
      <div className="auth-bg-blob auth-bg-blob-1" />
      <div className="auth-bg-blob auth-bg-blob-2" />

      <div className="auth-card glass-strong">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon"><Leaf size={20} strokeWidth={2.5} /></div>
          <span>Agro<strong>Link</strong></span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your AgroLink account</p>
        </div>

        {serverError && (
          <div className="auth-error" role="alert">
            <Lock size={14} />
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="login-email"
                type="email"
                className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
              />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <a href="#" className="auth-forgot">Forgot password?</a>
            </div>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                placeholder="••••••••••"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            id="login-submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="auth-spinner" /> : <><span>Sign In</span><ArrowRight size={17} /></>}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="auth-demo-hint">
          <span className="auth-demo-label">Demo credentials:</span>
          <code>admin@agrolink.com</code> / <code>password123</code>
        </div>

        <div className="auth-divider"><span>Don't have an account?</span></div>

        <Link to="/register" className="btn btn-outline auth-alt-btn">
          Create a free account
        </Link>
      </div>

      {/* Bottom link back to landing */}
      <Link to="/" className="auth-back-link">← Back to AgroLink</Link>
    </div>
  );
};

export default Login;
