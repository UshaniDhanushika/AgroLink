import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import {
  Eye, EyeOff, Leaf, ArrowRight, Lock, Mail,
  User, Phone, Building2, CheckCircle2,
} from 'lucide-react';
import './AuthPages.css';

/* ─── Types ────────────────────────────────────────────────── */
type UserRole = 'BUYER' | 'SELLER' | 'LOGISTICS';

interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  organizationName: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

/* ─── Role config ───────────────────────────────────────────── */
const roles: { value: UserRole; icon: string; name: string; desc: string }[] = [
  {
    value: 'BUYER',
    icon: '🛒',
    name: 'Buyer',
    desc: 'Purchase agricultural commodities from verified sellers',
  },
  {
    value: 'SELLER',
    icon: '🌾',
    name: 'Seller / Farmer',
    desc: 'List and sell your farm produce to buyers directly',
  },
  {
    value: 'LOGISTICS',
    icon: '🚛',
    name: 'Logistics',
    desc: 'Provide transport & delivery services for shipments',
  },
];

/* ─── Password strength ─────────────────────────────────────── */
function getPasswordStrength(pw: string) {
  if (!pw) return { score: 0, label: '', color: 'transparent', width: '0%' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '',          color: 'transparent',        width: '0%'   },
    { label: 'Very Weak', color: '#ef4444',             width: '20%'  },
    { label: 'Weak',      color: '#f97316',             width: '40%'  },
    { label: 'Fair',      color: '#eab308',             width: '60%'  },
    { label: 'Strong',    color: '#22c55e',             width: '80%'  },
    { label: 'Very Strong', color: '#6dbf67',           width: '100%' },
  ];
  return map[score] ?? map[4];
}

/* ─── Component ─────────────────────────────────────────────── */
const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ defaultValues: { role: 'BUYER' } });

  const { login } = useAuth();
  const navigate  = useNavigate();

  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm,  setShowConfirm]    = useState(false);
  const [serverError,  setServerError]    = useState('');
  const [success,      setSuccess]        = useState(false);

  const watchedRole     = watch('role');
  const watchedPassword = watch('password', '');
  const strength        = useMemo(() => getPasswordStrength(watchedPassword), [watchedPassword]);

  /* ─── Submit ─────────────────────────────────────────────── */
  const onSubmit = async (data: RegisterForm) => {
    setServerError('');
    try {
      // Mock registration — replace with POST /api/v1/auth/register when backend is ready
      await new Promise(res => setTimeout(res, 1200));

      // Check for duplicate email (mock)
      if (data.email === 'admin@agrolink.com') {
        setServerError('An account with this email already exists.');
        return;
      }

      // Simulate successful registration and auto-login
      setSuccess(true);
      await new Promise(res => setTimeout(res, 1000));

      login('mock-jwt-token', {
        id: Date.now().toString(),
        name: data.fullName,
        email: data.email,
        role: data.role,
      });

      navigate('/dashboard', { replace: true });
    } catch {
      setServerError('Registration failed. Please try again.');
    }
  };

  /* ─── Success state ─────────────────────────────────────── */
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg-blob auth-bg-blob-1" />
        <div className="auth-bg-blob auth-bg-blob-2" />
        <div className="auth-card glass-strong" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={56} color="#6dbf67" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--txt-primary)', marginBottom: '0.5rem' }}>
            Account Created!
          </h2>
          <p style={{ color: 'var(--txt-muted)', fontSize: '0.9rem' }}>
            Welcome to AgroLink. Redirecting to your dashboard…
          </p>
          <div className="auth-spinner" style={{ margin: '1.5rem auto 0' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-blob auth-bg-blob-1" />
      <div className="auth-bg-blob auth-bg-blob-2" />

      <div className="auth-card glass-strong">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon"><Leaf size={20} strokeWidth={2.5} /></div>
          <span>Agro<strong>Link</strong></span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join 12,000+ farms already using AgroLink</p>
        </div>

        {serverError && (
          <div className="auth-error" role="alert">
            <Lock size={14} />
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate id="register-form">

          {/* ── Role Selection ─────────────────────────────────── */}
          <div className="auth-field">
            <label className="auth-label">I am a…</label>
            <div className="role-grid">
              {roles.map(r => (
                <label key={r.value} className="role-option" htmlFor={`role-${r.value}`}>
                  <input
                    id={`role-${r.value}`}
                    type="radio"
                    value={r.value}
                    {...register('role', { required: 'Please select a role' })}
                    onChange={() => setValue('role', r.value, { shouldValidate: true })}
                  />
                  <div className={`role-card ${watchedRole === r.value ? 'role-card-active' : ''}`}>
                    <div className="role-icon">{r.icon}</div>
                    <div className="role-name">{r.name}</div>
                    <div className="role-desc">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <span className="auth-field-error">{errors.role.message}</span>}
          </div>

          {/* ── Full Name ─────────────────────────────────────── */}
          <div className="auth-field">
            <label htmlFor="reg-fullname" className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <User size={16} className="auth-input-icon" />
              <input
                id="reg-fullname"
                type="text"
                className={`auth-input ${errors.fullName ? 'auth-input-error' : ''}`}
                placeholder="e.g. Ravi Perera"
                autoComplete="name"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'At least 2 characters' },
                  maxLength: { value: 80, message: 'Maximum 80 characters' },
                })}
              />
            </div>
            {errors.fullName && <span className="auth-field-error">{errors.fullName.message}</span>}
          </div>

          {/* ── Email ─────────────────────────────────────────── */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="reg-email"
                type="email"
                className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          {/* ── Phone ─────────────────────────────────────────── */}
          <div className="auth-field">
            <label htmlFor="reg-phone" className="auth-label">
              Phone Number <span style={{ color: 'var(--txt-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <div className="auth-input-wrap">
              <Phone size={16} className="auth-input-icon" />
              <input
                id="reg-phone"
                type="tel"
                className={`auth-input ${errors.phone ? 'auth-input-error' : ''}`}
                placeholder="+94 77 123 4567"
                autoComplete="tel"
                {...register('phone', {
                  pattern: {
                    value: /^[+]?[\d\s\-().]{7,20}$/,
                    message: 'Enter a valid phone number',
                  },
                })}
              />
            </div>
            {errors.phone && <span className="auth-field-error">{errors.phone.message}</span>}
          </div>

          {/* ── Organization ──────────────────────────────────── */}
          <div className="auth-field">
            <label htmlFor="reg-org" className="auth-label">
              {watchedRole === 'BUYER'     ? 'Organisation / Company Name' :
               watchedRole === 'SELLER'   ? 'Farm / Business Name' :
               'Logistics Company Name'}
              <span style={{ color: 'var(--txt-muted)', fontWeight: 400 }}> (optional)</span>
            </label>
            <div className="auth-input-wrap">
              <Building2 size={16} className="auth-input-icon" />
              <input
                id="reg-org"
                type="text"
                className="auth-input"
                placeholder={
                  watchedRole === 'BUYER'     ? 'e.g. Green Valley Imports' :
                  watchedRole === 'SELLER'    ? 'e.g. Sunrise Organic Farm' :
                  'e.g. Swift Agri Logistics'
                }
                autoComplete="organization"
                {...register('organizationName', {
                  maxLength: { value: 100, message: 'Maximum 100 characters' },
                })}
              />
            </div>
            {errors.organizationName && (
              <span className="auth-field-error">{errors.organizationName.message}</span>
            )}
          </div>

          {/* ── Password ──────────────────────────────────────── */}
          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                placeholder="Min. 10 characters"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 10, message: 'Minimum 10 characters (per policy)' },
                  validate: v => {
                    if (!/[A-Z]/.test(v)) return 'Must contain at least one uppercase letter';
                    if (!/[0-9]/.test(v)) return 'Must contain at least one number';
                    return true;
                  },
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
            {/* Strength meter */}
            {watchedPassword && (
              <div className="password-strength">
                <div className="strength-bar-track">
                  <div
                    className="strength-bar-fill"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
          </div>

          {/* ── Confirm Password ───────────────────────────────── */}
          <div className="auth-field">
            <label htmlFor="reg-confirm" className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: v => v === watchedPassword || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="auth-field-error">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* ── Terms ─────────────────────────────────────────── */}
          <div className="auth-field">
            <label className="terms-row">
              <input
                id="reg-terms"
                type="checkbox"
                {...register('agreeTerms', { required: 'You must accept the terms to register' })}
              />
              <span>
                I agree to the{' '}
                <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                {' '}and{' '}
                <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                Your farm data is yours and will never be sold.
              </span>
            </label>
            {errors.agreeTerms && (
              <span className="auth-field-error">{errors.agreeTerms.message}</span>
            )}
          </div>

          {/* ── Submit ─────────────────────────────────────────── */}
          <button
            type="submit"
            id="register-submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <span className="auth-spinner" />
              : <><span>Create Account</span><ArrowRight size={17} /></>
            }
          </button>
        </form>

        {/* Role info strip */}
        <div className="auth-demo-hint" style={{ marginTop: '1rem' }}>
          <span className="auth-demo-label">Roles:</span>
          <span>Buyer · Seller · Logistics · (Admin via platform)</span>
        </div>

        <div className="auth-divider"><span>Already have an account?</span></div>

        <Link to="/login" className="btn btn-outline auth-alt-btn">
          Sign In
        </Link>
      </div>

      <Link to="/" className="auth-back-link">← Back to AgroLink</Link>
    </div>
  );
};

export default Register;
