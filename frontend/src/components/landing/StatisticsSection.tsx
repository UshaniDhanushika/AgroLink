import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Handshake, Truck, Users2, TrendingUp, ShoppingBag } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './StatisticsSection.css';

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sub: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <Users2 size={28} />,
    value: 3200,
    suffix: '+',
    label: 'Registered Users',
    sub: 'Farmers, buyers & logistics providers',
    color: '#6dbf67',
  },
  {
    icon: <ShoppingBag size={28} />,
    value: 850,
    suffix: '+',
    label: 'Active Buyer Requests',
    sub: 'Live harvest requests posted this month',
    color: '#f5c842',
  },
  {
    icon: <Handshake size={28} />,
    value: 12400,
    suffix: '+',
    label: 'Trades Completed',
    sub: 'Successfully matched & settled',
    color: '#6dbf67',
  },
  {
    icon: <TrendingUp size={28} />,
    value: 22,
    suffix: '%',
    prefix: '+',
    label: 'Higher Farm Price',
    sub: 'Compared to local market middlemen',
    color: '#a8e6cf',
  },
  {
    icon: <Truck size={28} />,
    value: 480,
    suffix: '+',
    label: 'Logistics Partners',
    sub: 'Covering all provinces in Sri Lanka',
    color: '#87ceeb',
  },
  {
    icon: <BarChart3 size={28} />,
    value: 98,
    suffix: '%',
    label: 'Payment Success Rate',
    sub: 'Secure & on-time settlements',
    color: '#f5c842',
  },
];

/* Animated counter hook */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

interface StatCounterProps { stat: Stat; index: number; inView: boolean }

const StatCounter: React.FC<StatCounterProps> = ({ stat, index, inView }) => {
  const val = useCountUp(stat.value, 1800 + index * 150, inView);
  return (
    <motion.div
      className="stat-card glass-card"
      id={`stat-card-${index}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
    >
      <div className="stat-icon-wrap" style={{ color: stat.color, borderColor: `${stat.color}33`, background: `${stat.color}15` }}>
        {stat.icon}
      </div>
      <div className="stat-value" style={{ color: stat.color }}>
        {stat.prefix}{val.toLocaleString()}{stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-sub">{stat.sub}</div>
      <div className="stat-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}18, transparent 70%)` }} />
    </motion.div>
  );
};

const StatisticsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="statistics" ref={sectionRef} className="stats-section section-pad">
      <div className="stats-bg-gradient" />
      <div className="container">
        <ScrollReveal direction="up">
          <div className="text-center">
            <div className="section-tag">
              <BarChart3 size={13} /> Marketplace by the Numbers
            </div>
            <h2 className="section-title">
              A thriving harvest <span>marketplace</span>
            </h2>
            <p className="section-desc">
              Real numbers from real trades — farmers earning more, buyers getting
              fresher produce, and logistics partners growing their business.
            </p>
          </div>
        </ScrollReveal>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <StatCounter key={i} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
