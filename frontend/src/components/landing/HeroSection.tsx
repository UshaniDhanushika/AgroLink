import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShoppingBag, Truck, TrendingUp, Package, Search } from 'lucide-react';
import './HeroSection.css';

/* ─── Floating stat card ──────────────────────────────────────────── */
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color, delay = 0, className = '' }) => (
  <motion.div
    className={`hero-stat-card ${className}`}
    initial={{ opacity: 0, scale: 0.7, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, delay, type: 'spring', bounce: 0.4 }}
  >
    <div className="hero-stat-icon" style={{ color }}>{icon}</div>
    <div>
      <div className="hero-stat-value" style={{ color }}>{value}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  </motion.div>
);

/* ─── Particle ────────────────────────────────────────────────────── */
const Particle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="hero-particle" style={style} />
);

/* ─── Live Buyer Request Card (dashboard mock) ───────────────────── */
const buyerRequests = [
  { crop: 'Red Onions',   qty: '20 MT',  price: 'Rs 85/kg',  badge: 'Urgent',  badgeColor: '#f5c842', icon: '🧅' },
  { crop: 'Tomatoes',     qty: '15 MT',  price: 'Rs 120/kg', badge: 'Open',    badgeColor: '#6dbf67', icon: '🍅' },
  { crop: 'Green Chilli', qty: '8 MT',   price: 'Rs 95/kg',  badge: 'Open',    badgeColor: '#6dbf67', icon: '🫑' },
];

/* ─── Main component ──────────────────────────────────────────────── */
const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Animated grid-field background on canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = 20;
      const rows = 14;
      const cw = canvas.width  / cols;
      const ch = canvas.height / rows;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const wave = Math.sin(t * 0.8 + c * 0.4 + r * 0.3) * 6;
          const x = c * cw;
          const y = r * ch + wave;
          const alpha = 0.06 + Math.sin(t + c + r) * 0.025;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(109, 191, 103, ${Math.max(0.02, alpha)})`;
          ctx.fill();
        }
      }

      ctx.strokeStyle = 'rgba(109,191,103,0.04)';
      ctx.lineWidth = 0.5;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const wave = Math.sin(t * 0.8 + c * 0.4 + r * 0.3) * 6;
          const x = c * cw;
          const y = r * ch + wave;
          c === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t += 0.02;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    style: {
      left:             `${5 + (i * 5.3) % 90}%`,
      top:              `${10 + (i * 7.1) % 80}%`,
      width:            `${4 + (i % 5) * 3}px`,
      height:           `${4 + (i % 5) * 3}px`,
      animationDelay:   `${(i * 0.7) % 5}s`,
      animationDuration:`${4 + (i % 4)}s`,
      opacity:          0.15 + (i % 4) * 0.08,
    },
  }));

  return (
    <section id="hero" className="hero-section">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Radial glow blobs */}
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      <div className="hero-glow hero-glow-3" />

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} style={p.style} />)}

      <div className="container">
        <div className="hero-inner">
          {/* Left: Text content */}
          <div className="hero-content">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Leaf size={14} />
              <span>Sri Lanka's Harvest Marketplace</span>
              <div className="hero-badge-dot" />
              <span className="hero-badge-sub">Farmers · Buyers · Logistics</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Harvest at the
              <br />
              <span className="text-gradient">Best Price.</span>
              <br />
              <span className="hero-title-light">Delivered Direct.</span>
            </motion.h1>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              AgroLink connects <strong>bulk buyers</strong> who post harvest requests with
              <strong> farmers</strong> who supply fresh produce at competitive prices —
              then <strong>logistics partners</strong> handle door-to-door delivery.
              No middlemen. Full transparency.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Link to="/register" className="btn btn-primary btn-lg hero-cta-primary">
                Join as Farmer <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-ghost btn-lg hero-cta-ghost" id="hero-post-request">
                <div className="hero-play-btn">
                  <ShoppingBag size={14} />
                </div>
                Post a Request
              </Link>
            </motion.div>

            {/* Role badges */}
            <motion.div
              className="hero-trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <div className="hero-trust-avatars">
                {['#2d9e5f','#6dbf67','#f5c842','#87ceeb'].map((c, i) => (
                  <div key={i} className="trust-avatar" style={{ background: c, marginLeft: i ? '-8px' : 0 }} />
                ))}
              </div>
              <span><strong>3,200+</strong> farmers, buyers & logistics providers active</span>
            </motion.div>
          </div>

          {/* Right: Live marketplace dashboard mock */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, type: 'spring', bounce: 0.3 }}
          >
            <div className="hero-dashboard glass-strong">
              {/* Dashboard header */}
              <div className="dash-header">
                <div className="dash-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="dash-title">Live Buyer Requests</span>
                <div className="dash-live">
                  <div className="dash-live-dot" />
                  LIVE
                </div>
              </div>

              {/* Search bar */}
              <div className="dash-search-bar">
                <Search size={13} style={{ color: '#6dbf67', flexShrink: 0 }} />
                <span className="dash-search-text">Search harvest requests by crop, quantity...</span>
              </div>

              {/* Buyer request cards */}
              <div className="dash-alerts">
                {buyerRequests.map((req, i) => (
                  <motion.div
                    key={i}
                    className="dash-alert dash-request-row"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.12 }}
                  >
                    <span className="dash-alert-icon">{req.icon}</span>
                    <div className="dash-req-info">
                      <span className="dash-req-crop">{req.crop}</span>
                      <span className="dash-req-qty">{req.qty}</span>
                    </div>
                    <div className="dash-req-right">
                      <span className="dash-req-price">{req.price}</span>
                      <span className="dash-req-badge" style={{ background: `${req.badgeColor}22`, color: req.badgeColor, border: `1px solid ${req.badgeColor}44` }}>
                        {req.badge}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Supply CTA row */}
              <motion.div
                className="dash-supply-cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <Package size={14} />
                <span>3 requests match your farm produce</span>
                <span className="dash-supply-btn">Supply Now →</span>
              </motion.div>
            </div>

            {/* Floating stat cards */}
            <StatCard
              icon={<TrendingUp size={18} />}
              value="Rs 85/kg"
              label="Best Offer Today"
              color="#6dbf67"
              delay={0.9}
              className="stat-card-yield"
            />
            <StatCard
              icon={<Truck size={18} />}
              value="48h"
              label="Avg. Delivery"
              color="#87ceeb"
              delay={1.05}
              className="stat-card-water"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="hero-fade-bottom" />
    </section>
  );
};

export default HeroSection;
