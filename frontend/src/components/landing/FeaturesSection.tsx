import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ClipboardList, Search, Handshake,
  Truck, ShieldCheck, Bell,
  BarChart2, Star, MapPin,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './FeaturesSection.css';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  gradient: string;
  role: 'buyer' | 'farmer' | 'logistics';
}

const features: Feature[] = [
  /* ── Buyers ─── */
  {
    icon: <ClipboardList size={26} />,
    title: 'Post Harvest Requests',
    description: 'Bulk buyers post exactly what they need — crop type, quantity, target price, and delivery date. Farmers instantly see and respond to your open requests.',
    badge: 'BUYERS',
    gradient: 'linear-gradient(135deg, rgba(245,200,66,0.25), rgba(232,160,32,0.1))',
    role: 'buyer',
  },
  {
    icon: <BarChart2 size={26} />,
    title: 'Live Price Discovery',
    description: 'See real-time supply offers from multiple farmers side-by-side. Compare prices, quality ratings, and farm locations before you commit.',
    badge: 'BUYERS',
    gradient: 'linear-gradient(135deg, rgba(245,200,66,0.2), rgba(232,160,32,0.08))',
    role: 'buyer',
  },
  {
    icon: <ShieldCheck size={26} />,
    title: 'Verified Farmer Profiles',
    description: 'Every farmer on AgroLink is verified. View ratings, past trade history, and produce quality certifications before accepting a supply offer.',
    badge: 'BUYERS',
    gradient: 'linear-gradient(135deg, rgba(245,200,66,0.18), rgba(109,191,103,0.08))',
    role: 'buyer',
  },
  /* ── Farmers ─── */
  {
    icon: <Search size={26} />,
    title: 'Browse Buyer Requests',
    description: 'Farmers browse live bulk-buyer requests filtered by crop type, region, and price. Find the best deal for your harvest without calling a single middleman.',
    badge: 'FARMERS',
    gradient: 'linear-gradient(135deg, rgba(45,158,95,0.25), rgba(109,191,103,0.1))',
    role: 'farmer',
  },
  {
    icon: <Handshake size={26} />,
    title: 'Submit Supply Offers',
    description: 'List your available harvest with quantity, grade, and asking price. Buyers receive your offer instantly and can accept, counter, or negotiate in-app.',
    badge: 'FARMERS',
    gradient: 'linear-gradient(135deg, rgba(109,191,103,0.2), rgba(45,158,95,0.1))',
    role: 'farmer',
  },
  {
    icon: <Bell size={26} />,
    title: 'Price Alert Notifications',
    description: 'Set price thresholds for your crops and get notified the moment a buyer posts a request that meets your target price — never miss the best deal.',
    badge: 'FARMERS',
    gradient: 'linear-gradient(135deg, rgba(168,230,207,0.2), rgba(87,171,131,0.1))',
    role: 'farmer',
  },
  /* ── Logistics ─── */
  {
    icon: <Truck size={26} />,
    title: 'Pick Up & Deliver',
    description: 'Logistics providers see confirmed trade orders on their dashboard. Claim delivery jobs, set rates, and get navigated from farm gate to buyer warehouse.',
    badge: 'LOGISTICS',
    gradient: 'linear-gradient(135deg, rgba(135,206,235,0.2), rgba(45,158,95,0.1))',
    role: 'logistics',
  },
  {
    icon: <MapPin size={26} />,
    title: 'Live Shipment Tracking',
    description: 'Both farmers and buyers track their shipment in real-time on a live map. ETA updates, pickup confirmations, and delivery proof — all in one place.',
    badge: 'LOGISTICS',
    gradient: 'linear-gradient(135deg, rgba(135,206,235,0.18), rgba(109,191,103,0.1))',
    role: 'logistics',
  },
  {
    icon: <Star size={26} />,
    title: 'Ratings & Earnings',
    description: 'Logistics partners build their reputation through delivery ratings. Top-rated providers get priority job matching and higher-value route assignments.',
    badge: 'LOGISTICS',
    gradient: 'linear-gradient(135deg, rgba(87,171,131,0.15), rgba(135,206,235,0.1))',
    role: 'logistics',
  },
];

const roleBadgeColors: Record<Feature['role'], { bg: string; color: string }> = {
  buyer:    { bg: 'rgba(245,200,66,0.15)',  color: '#f5c842' },
  farmer:   { bg: 'rgba(109,191,103,0.15)', color: '#6dbf67' },
  logistics:{ bg: 'rgba(135,206,235,0.15)', color: '#87ceeb' },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const FeaturesSection: React.FC = () => (
  <section id="features" className="features-section section-pad">
    <div className="features-bg-blob" />
    <div className="container">
      <ScrollReveal direction="up">
        <div className="text-center">
          <div className="section-tag">
            <Handshake size={13} /> Platform Features
          </div>
          <h2 className="section-title">
            One platform. <span>Three roles. Zero middlemen.</span>
          </h2>
          <p className="section-desc">
            AgroLink is purpose-built for the harvest trade chain —
            from bulk buyers posting requests to farmers supplying produce,
            and logistics partners closing the delivery loop.
          </p>

          {/* Role legend */}
          <div className="features-role-legend">
            {(['buyer','farmer','logistics'] as Feature['role'][]).map(role => (
              <span
                key={role}
                className="features-role-tag"
                style={{ background: roleBadgeColors[role].bg, color: roleBadgeColors[role].color, border: `1px solid ${roleBadgeColors[role].color}33` }}
              >
                {role === 'buyer' ? '🛒 Buyers' : role === 'farmer' ? '🌾 Farmers' : '🚛 Logistics'}
              </span>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {features.map((feat, i) => (
          <motion.div key={i} variants={cardVariants}>
            <div className="feature-card glass-card" id={`feature-card-${i}`}>
              <div className="feature-glow" style={{ background: feat.gradient }} />
              <div className="feature-icon-wrap">
                <div className="feature-icon" style={{ color: roleBadgeColors[feat.role].color }}>{feat.icon}</div>
                {feat.badge && (
                  <span
                    className="badge"
                    style={{ background: roleBadgeColors[feat.role].bg, color: roleBadgeColors[feat.role].color, border: `1px solid ${roleBadgeColors[feat.role].color}33` }}
                  >
                    {feat.badge}
                  </span>
                )}
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.description}</p>
              <div className="feature-arrow" style={{ color: roleBadgeColors[feat.role].color }}>→</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
