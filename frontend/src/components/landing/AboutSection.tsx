import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Leaf, Award, ShoppingBag, Truck, Users } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './AboutSection.css';

const pillars = [
  { icon: <CheckCircle2 size={18} />, text: 'Direct farmer-to-buyer trading' },
  { icon: <CheckCircle2 size={18} />, text: 'No commission middlemen' },
  { icon: <CheckCircle2 size={18} />, text: '22% higher prices for farmers' },
  { icon: <CheckCircle2 size={18} />, text: 'Integrated last-mile logistics' },
  { icon: <CheckCircle2 size={18} />, text: 'Secure in-app payments' },
  { icon: <CheckCircle2 size={18} />, text: 'Full trade history & receipts' },
];

const milestones = [
  { icon: <Leaf size={22} />,         year: '2022', text: 'AgroLink founded in Colombo — with a vision to eliminate harvest middlemen and give farmers full control of their pricing.' },
  { icon: <Users size={22} />,        year: '2023', text: 'First 500 farmer and buyer registrations. Rs 12 million worth of direct harvest trades completed in the first season.' },
  { icon: <Truck size={22} />,        year: '2024', text: 'Launched integrated logistics network. 150+ transport providers joined the platform covering all 9 provinces.' },
  { icon: <ShoppingBag size={22} />,  year: '2025', text: 'Crossed 12,400 trades, 3,200+ active users. Avg. farmer selling price 22% higher than local pola market.' },
];

const roleCards = [
  {
    emoji: '🌾',
    title: 'For Farmers',
    desc: 'Browse buyer requests, submit offers at your price, and get paid directly — no agents, no delays.',
    color: '#6dbf67',
  },
  {
    emoji: '🛒',
    title: 'For Buyers',
    desc: 'Post exactly what you need. Multiple verified farmers compete to supply you at the best price.',
    color: '#f5c842',
  },
  {
    emoji: '🚛',
    title: 'For Logistics',
    desc: 'Claim confirmed delivery jobs from your dashboard and build a sustainable transport business.',
    color: '#87ceeb',
  },
];

const AboutSection: React.FC = () => (
  <section id="about" className="about-section section-pad">
    <div className="about-bg-blob-l" />
    <div className="about-bg-blob-r" />
    <div className="container">
      <div className="about-grid">
        {/* Left visual */}
        <ScrollReveal direction="left">
          <div className="about-visual">
            <div className="about-image-frame glass-strong">
              <div className="about-illustration">
                {/* SVG Marketplace Illustration */}
                <svg viewBox="0 0 320 260" className="about-svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d2218" />
                      <stop offset="100%" stopColor="#1a4a2e" />
                    </linearGradient>
                    <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6dbf67" />
                      <stop offset="100%" stopColor="#2d9e5f" />
                    </linearGradient>
                  </defs>
                  <rect width="320" height="260" fill="url(#skyGrad2)" rx="16" />

                  {/* Stars */}
                  {[[40,30],[80,18],[130,25],[200,35],[260,20],[100,45],[170,12]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r={1.2} fill="rgba(255,255,255,0.6)" />
                  ))}

                  {/* Farmer card */}
                  <rect x="16" y="50" width="88" height="66" rx="8" fill="rgba(45,158,95,0.18)" stroke="rgba(109,191,103,0.4)" strokeWidth="1" />
                  <text x="26" y="68" fill="#6dbf67" fontSize="7" fontWeight="bold">🌾 FARMER</text>
                  <text x="26" y="82" fill="rgba(255,255,255,0.7)" fontSize="6">Tomatoes · 5 MT</text>
                  <text x="26" y="94" fill="#6dbf67" fontSize="7" fontWeight="bold">Rs 110/kg</text>
                  <rect x="26" y="100" width="60" height="8" rx="4" fill="rgba(109,191,103,0.3)" />
                  <rect x="26" y="100" width="42" height="8" rx="4" fill="#6dbf67" />

                  {/* Arrow right */}
                  <text x="112" y="88" fill="rgba(255,255,255,0.5)" fontSize="18">→</text>

                  {/* Marketplace hub */}
                  <rect x="132" y="44" width="56" height="80" rx="8" fill="rgba(13,34,24,0.9)" stroke="rgba(109,191,103,0.4)" strokeWidth="1" />
                  <text x="143" y="60" fill="#6dbf67" fontSize="6" fontWeight="bold">AGROLINK</text>
                  <circle cx="160" cy="80" r="16" fill="rgba(109,191,103,0.15)" stroke="rgba(109,191,103,0.4)" strokeWidth="1" />
                  <text x="152" y="84" fill="#6dbf67" fontSize="12">🔗</text>
                  <text x="140" y="108" fill="rgba(168,230,207,0.7)" fontSize="5">MATCHED</text>

                  {/* Arrow right */}
                  <text x="196" y="88" fill="rgba(255,255,255,0.5)" fontSize="18">→</text>

                  {/* Buyer card */}
                  <rect x="216" y="50" width="88" height="66" rx="8" fill="rgba(245,200,66,0.12)" stroke="rgba(245,200,66,0.35)" strokeWidth="1" />
                  <text x="226" y="68" fill="#f5c842" fontSize="7" fontWeight="bold">🛒 BUYER</text>
                  <text x="226" y="82" fill="rgba(255,255,255,0.7)" fontSize="6">Need 5 MT tomatoes</text>
                  <text x="226" y="94" fill="#f5c842" fontSize="7" fontWeight="bold">Rs 115/kg max</text>
                  <text x="226" y="107" fill="rgba(245,200,66,0.6)" fontSize="5">✓ CONFIRMED</text>

                  {/* Logistics bar at bottom */}
                  <rect x="16" y="148" width="288" height="52" rx="8" fill="rgba(135,206,235,0.08)" stroke="rgba(135,206,235,0.3)" strokeWidth="1" />
                  <text x="26" y="165" fill="#87ceeb" fontSize="7" fontWeight="bold">🚛 LOGISTICS PARTNER</text>
                  <text x="26" y="179" fill="rgba(255,255,255,0.6)" fontSize="6">Collecting from farm · ETA 2h · Live tracking active</text>
                  <rect x="26" y="187" width="230" height="5" rx="2.5" fill="rgba(135,206,235,0.15)" />
                  <rect x="26" y="187" width="160" height="5" rx="2.5" fill="#87ceeb" />

                  {/* Payment confirmed */}
                  <rect x="60" y="218" width="200" height="28" rx="6" fill="rgba(109,191,103,0.15)" stroke="rgba(109,191,103,0.3)" strokeWidth="1" />
                  <text x="80" y="235" fill="#6dbf67" fontSize="7" fontWeight="bold">✅  Payment released to farmer — Rs 550,000</text>
                </svg>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="about-float-badge glass"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            >
              <Award size={20} color="#f5c842" />
              <div>
                <div className="about-badge-title">Zero Middlemen</div>
                <div className="about-badge-sub">Direct farm-to-buyer trading</div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Right text */}
        <ScrollReveal direction="right">
          <div className="about-content">
            <div className="section-tag"><Leaf size={13} /> Our Mission</div>
            <h2 className="section-title">
              Cutting out the middleman, <span>for good</span>
            </h2>
            <p className="about-lead">
              Sri Lanka's farmers lose up to 60% of their harvest revenue to traders and
              brokers before it ever reaches a buyer. AgroLink was built to end that.
            </p>
            <p style={{ color: 'var(--txt-secondary)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              We connect bulk buyers — supermarkets, hotels, exporters — directly with
              verified farmers. Every transaction is transparent, every payment is
              secured in-app, and every delivery is tracked door-to-door. Farmers
              earn more. Buyers pay less. And food gets fresher.
            </p>

            {/* Role cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {roleCards.map((r, i) => (
                <div key={i} className="about-pillar" style={{ background: `${r.color}0d`, borderColor: `${r.color}22` }}>
                  <span style={{ fontSize: '1.1rem' }}>{r.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: r.color }}>{r.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--txt-secondary)', marginTop: '2px' }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pillars checklist */}
            <div className="about-pillars">
              {pillars.map((p, i) => (
                <div key={i} className="about-pillar">
                  <span className="about-pillar-icon">{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Timeline */}
      <ScrollReveal direction="up" delay={100}>
        <div className="about-timeline">
          <h3 className="about-timeline-heading text-center">Our Journey</h3>
          <div className="timeline-track">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="timeline-icon">{m.icon}</div>
                <div className="timeline-year">{m.year}</div>
                <p className="timeline-text">{m.text}</p>
                {i < milestones.length - 1 && <div className="timeline-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default AboutSection;
