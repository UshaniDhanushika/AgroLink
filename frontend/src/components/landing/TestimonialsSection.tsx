import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './TestimonialsSection.css';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  metric: string;
  metricLabel: string;
  roleType: 'farmer' | 'buyer' | 'logistics';
  roleColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sunil Rajapaksa',
    role: 'Vegetable Farmer',
    location: 'Nuwara Eliya, Sri Lanka',
    avatar: 'SR',
    rating: 5,
    roleType: 'farmer',
    roleColor: '#6dbf67',
    text: 'Before AgroLink I sold my tomatoes to the pola for Rs 40/kg. Last month a buyer from Colombo posted a request at Rs 110/kg and I supplied 3 MT directly. No middle man, no commission. The payment came the next day.',
    metric: '+175%',
    metricLabel: 'Higher price vs local pola',
  },
  {
    name: 'Pradeep Wijesinghe',
    role: 'Wholesale Buyer — Supermarket Chain',
    location: 'Colombo, Sri Lanka',
    avatar: 'PW',
    rating: 5,
    roleType: 'buyer',
    roleColor: '#f5c842',
    text: 'We post our weekly produce requirements on AgroLink and within hours we have offers from 10+ verified farmers. The quality is consistent, prices are 20% better than Dambulla, and logistics is handled for us.',
    metric: '20%',
    metricLabel: 'Cost saving vs Dambulla market',
  },
  {
    name: 'Kumara Bandara',
    role: 'Logistics Provider',
    location: 'Kandy, Sri Lanka',
    avatar: 'KB',
    rating: 5,
    roleType: 'logistics',
    roleColor: '#87ceeb',
    text: 'I used to wait for phone calls for transport jobs. Now AgroLink sends me confirmed delivery jobs every morning. My lorry is always full. I earned 3× more last quarter just by using the platform instead of agents.',
    metric: '3×',
    metricLabel: 'Earnings vs agent system',
  },
  {
    name: 'Chamari Senanayake',
    role: 'Onion & Chilli Farmer',
    location: 'Matale, Sri Lanka',
    avatar: 'CS',
    rating: 5,
    roleType: 'farmer',
    roleColor: '#6dbf67',
    text: 'I set a price alert for Rs 80/kg for my red onions. Within 2 days I got a notification — a buyer in Galle had posted exactly that. I submitted my offer, it was accepted in one hour. Sold 5 MT same week.',
    metric: '5 MT',
    metricLabel: 'Sold in one week at target price',
  },
  {
    name: 'Niroshan Jayawardena',
    role: 'Hotel Procurement Manager',
    location: 'Galle, Sri Lanka',
    avatar: 'NJ',
    rating: 5,
    roleType: 'buyer',
    roleColor: '#f5c842',
    text: 'As a hotel we need fresh produce daily. AgroLink let us build relationships with 5 verified farms directly. Our produce is fresher, our menu costs are down, and we know exactly where our food comes from.',
    metric: '48h',
    metricLabel: 'Farm to kitchen delivery time',
  },
];

const TestimonialsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent(prev => (prev + dir + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" className="testimonials-section section-pad">
      <div className="test-bg-blob-l" />
      <div className="test-bg-blob-r" />
      <div className="container">
        <ScrollReveal direction="up">
          <div className="text-center">
            <div className="section-tag">
              <MessageSquare size={13} /> Success Stories
            </div>
            <h2 className="section-title">
              Farmers, buyers & logistics <span>all winning</span>
            </h2>
            <p className="section-desc">
              Real stories from the AgroLink community. Farmers selling direct,
              buyers getting fresher produce cheaper, and logistics partners earning more.
            </p>
          </div>
        </ScrollReveal>

        {/* Main testimonial carousel */}
        <div className="test-carousel-wrap">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              className="test-card glass-strong"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="test-card-inner">
                {/* Left: Quote */}
                <div className="test-quote-side">
                  <div className="test-role-pill" style={{ background: `${t.roleColor}18`, color: t.roleColor, border: `1px solid ${t.roleColor}33` }}>
                    {t.roleType === 'farmer' ? '🌾' : t.roleType === 'buyer' ? '🛒' : '🚛'} {t.role}
                  </div>

                  <Quote size={36} className="test-quote-icon" />
                  <p className="test-text">"{t.text}"</p>

                  <div className="test-stars">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="#f5c842" color="#f5c842" />
                    ))}
                  </div>

                  <div className="test-author">
                    <div className="test-avatar" style={{ background: `${t.roleColor}33`, color: t.roleColor }}>{t.avatar}</div>
                    <div>
                      <div className="test-name">{t.name}</div>
                      <div className="test-role">{t.location}</div>
                    </div>
                  </div>
                </div>

                {/* Right: Metric callout */}
                <div className="test-metric-side">
                  <motion.div
                    className="test-metric-card"
                    style={{ borderColor: `${t.roleColor}33`, background: `${t.roleColor}0d` }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="test-metric-val" style={{ color: t.roleColor }}>{t.metric}</div>
                    <div className="test-metric-lbl">{t.metricLabel}</div>
                  </motion.div>

                  <div className="test-progress">
                    <div className="test-progress-label">
                      {current + 1} / {testimonials.length}
                    </div>
                    <div className="test-progress-track">
                      <motion.div
                        className="test-progress-fill"
                        style={{ background: t.roleColor }}
                        animate={{ width: `${((current + 1) / testimonials.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="test-nav">
            <button id="testimonial-prev" className="test-nav-btn" onClick={() => navigate(-1)} aria-label="Previous testimonial">
              <ChevronLeft size={20} />
            </button>

            <div className="test-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`test-dot ${i === current ? 'test-dot-active' : ''}`}
                  style={i === current ? { background: t.roleColor } : {}}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button id="testimonial-next" className="test-nav-btn" onClick={() => navigate(1)} aria-label="Next testimonial">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Mini testimonial strip */}
        <ScrollReveal direction="up" delay={100}>
          <div className="test-strip">
            {testimonials.map((t2, i) => (
              <button
                key={i}
                className={`test-strip-item ${i === current ? 'active' : ''}`}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              >
                <div
                  className="test-strip-avatar"
                  style={i === current ? { background: `${t2.roleColor}33`, color: t2.roleColor } : {}}
                >
                  {t2.avatar}
                </div>
                <div className="test-strip-name">{t2.name}</div>
                <div className="test-strip-loc">{t2.location}</div>
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
