import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './ContactSection.css';

interface FormData {
  name: string;
  email: string;
  farmSize: string;
  message: string;
}

const farmSizes = [
  'Under 10 acres',
  '10–100 acres',
  '100–500 acres',
  '500–2000 acres',
  '2000+ acres',
];

const ContactSection: React.FC = () => {
  const [form, setForm] = useState<FormData>({ name: '', email: '', farmSize: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contact" className="contact-section section-pad">
      <div className="contact-bg-blob-t" />
      <div className="contact-bg-blob-b" />
      <div className="container">
        <ScrollReveal direction="up">
          <div className="text-center">
            <div className="section-tag">
              <MessageSquare size={13} /> Contact
            </div>
            <h2 className="section-title">
              Get in touch, <span>start growing</span>
            </h2>
            <p className="section-desc">
              Whether you have a question, want a personalised demo, or are ready to sign up —
              we'd love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        <div className="contact-layout">
          {/* Info cards */}
          <ScrollReveal direction="left">
            <div className="contact-info">
              {[
                { icon: <Mail size={20} />, label: 'Email Us', value: 'hello@agrolink.io', sub: 'Reply within 4 hours' },
                { icon: <Phone size={20} />, label: 'Call Us', value: '+94 11 234 5678', sub: 'Mon–Fri, 8am – 8pm IST' },
                { icon: <MapPin size={20} />, label: 'Visit Us', value: '42 Tech City, Colombo 03', sub: 'Sri Lanka · HQ' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="contact-info-card glass-card"
                  id={`contact-info-${i}`}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <div className="contact-info-label">{item.label}</div>
                    <div className="contact-info-value">{item.value}</div>
                    <div className="contact-info-sub">{item.sub}</div>
                  </div>
                </motion.div>
              ))}

              {/* Map placeholder */}
              <div className="contact-map glass">
                <svg viewBox="0 0 320 180" className="contact-map-svg" aria-label="Map placeholder">
                  <defs>
                    <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0d2218" />
                      <stop offset="100%" stopColor="#1a4a2e" />
                    </linearGradient>
                  </defs>
                  <rect width="320" height="180" fill="url(#mapGrad)" />
                  {/* Grid lines */}
                  {[40,80,120,160].map(y => (
                    <line key={`h${y}`} x1="0" y1={y} x2="320" y2={y} stroke="rgba(109,191,103,0.1)" strokeWidth="0.5" />
                  ))}
                  {[60,120,180,240,300].map(x => (
                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" stroke="rgba(109,191,103,0.1)" strokeWidth="0.5" />
                  ))}
                  {/* Roads */}
                  <path d="M0,90 Q80,80 160,90 Q240,100 320,90" stroke="rgba(109,191,103,0.3)" strokeWidth="2" fill="none" />
                  <path d="M160,0 Q155,60 160,90 Q165,130 160,180" stroke="rgba(109,191,103,0.25)" strokeWidth="1.5" fill="none" />
                  {/* Pin */}
                  <circle cx="160" cy="90" r="12" fill="rgba(45,158,95,0.25)" stroke="#6dbf67" strokeWidth="1.5" />
                  <circle cx="160" cy="90" r="4" fill="#6dbf67" />
                  <circle cx="160" cy="90" r="20" fill="none" stroke="rgba(109,191,103,0.3)" strokeWidth="1">
                    <animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="160" y="125" textAnchor="middle" fill="rgba(168,230,207,0.7)" fontSize="11">Colombo, Sri Lanka</text>
                </svg>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal direction="right">
            <div className="contact-form-wrap glass-strong">
              {submitted ? (
                <motion.div
                  className="contact-success"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                >
                  <CheckCircle size={52} color="#6dbf67" />
                  <h3>Message Sent!</h3>
                  <p>Thanks {form.name}! We'll get back to you at <strong>{form.email}</strong> within 4 hours.</p>
                  <button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', farmSize: '', message: '' }); }}>
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate id="contact-form">
                  <h3 className="contact-form-title">Send us a message</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name">Full Name</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Ravi Perera"
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email">Email Address</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-farmsize">Farm Size</label>
                    <select
                      id="contact-farmsize"
                      name="farmSize"
                      value={form.farmSize}
                      onChange={handleChange}
                      className="form-input form-select"
                    >
                      <option value="">Select farm size...</option>
                      {farmSizes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your farm and what you'd like to achieve..."
                      required
                      rows={5}
                      className="form-input form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg contact-submit"
                    id="contact-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="contact-spinner" />
                    ) : (
                      <><Send size={17} /> Send Message</>
                    )}
                  </button>

                  <p className="contact-privacy">
                    By submitting, you agree to our Privacy Policy. We never share your data.
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
