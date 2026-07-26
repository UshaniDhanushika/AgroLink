import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, Handshake,
  Truck, CheckCircle, ChevronRight, Workflow,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './HowItWorksSection.css';

/* ─── Journey tabs ──────────────────────────────────────────────────────── */
interface Journey {
  role: string;
  emoji: string;
  tagline: string;
  color: string;
  steps: {
    number: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    details: string[];
  }[];
}

const journeys: Journey[] = [
  {
    role: 'Buyer',
    emoji: '🛒',
    tagline: 'Post what you need. Farmers come to you.',
    color: '#f5c842',
    steps: [
      {
        number: '01',
        icon: <ShoppingBag size={24} />,
        title: 'Post a Harvest Request',
        description:
          'Specify the crop, quantity you need, target price per kg, and required delivery date. Your request goes live instantly and is visible to all matched farmers.',
        details: [
          'Select from 80+ crop varieties',
          'Set minimum quality grade',
          'Request is live within 30 seconds',
        ],
      },
      {
        number: '02',
        icon: <Search size={24} />,
        title: 'Receive Farmer Supply Offers',
        description:
          'Farmers who have your required produce submit supply offers with their price, quantity, and quality details. Compare multiple offers side-by-side on your dashboard.',
        details: [
          'Real-time offer notifications',
          'View farmer ratings & trade history',
          'Counter-offer or accept instantly',
        ],
      },
      {
        number: '03',
        icon: <Handshake size={24} />,
        title: 'Confirm & Arrange Delivery',
        description:
          'Accept the best offer and confirm the trade. AgroLink auto-assigns a logistics partner to collect from the farm and deliver to your warehouse.',
        details: [
          'Secure in-app payment hold',
          'Auto-matched logistics partner',
          'Live shipment tracking',
        ],
      },
      {
        number: '04',
        icon: <CheckCircle size={24} />,
        title: 'Receive & Rate',
        description:
          'Confirm receipt of produce at delivery. Payment is released to the farmer. Rate the farmer and logistics provider to build community trust.',
        details: [
          'Quality verification on delivery',
          'Instant payment release',
          'Rate & review both parties',
        ],
      },
    ],
  },
  {
    role: 'Farmer',
    emoji: '🌾',
    tagline: 'Find the best price. Sell direct.',
    color: '#6dbf67',
    steps: [
      {
        number: '01',
        icon: <Search size={24} />,
        title: 'Browse Live Buyer Requests',
        description:
          'See all open bulk-buyer requests for your crops filtered by region and price. No phone calls, no agents — just a clear marketplace of who needs what.',
        details: [
          'Filter by crop type & location',
          'Sort by best price offered',
          'Set price alerts for your crops',
        ],
      },
      {
        number: '02',
        icon: <ShoppingBag size={24} />,
        title: 'Submit a Supply Offer',
        description:
          'Found a good match? Submit your offer: quantity available, quality grade, and your asking price. The buyer is notified instantly and can accept or negotiate.',
        details: [
          'Add harvest photos & grade',
          'Set your asking price freely',
          'Multiple offers on one listing',
        ],
      },
      {
        number: '03',
        icon: <Handshake size={24} />,
        title: 'Confirm the Trade',
        description:
          'Once the buyer accepts, the trade is confirmed in-app. A logistics provider is assigned to collect your produce from your farm gate on the agreed date.',
        details: [
          'Trade confirmation in-app',
          'Logistics arrives at your farm',
          'No transport cost to you',
        ],
      },
      {
        number: '04',
        icon: <CheckCircle size={24} />,
        title: 'Get Paid Instantly',
        description:
          'After the buyer confirms receipt, your payment is released directly to your account. No 30-day waits, no cheques — just fast, transparent settlement.',
        details: [
          'Payment within 24 hours of delivery',
          'Full trade history in your account',
          'Build your seller rating',
        ],
      },
    ],
  },
  {
    role: 'Logistics',
    emoji: '🚛',
    tagline: 'Claim delivery jobs. Earn more.',
    color: '#87ceeb',
    steps: [
      {
        number: '01',
        icon: <Truck size={24} />,
        title: 'Browse Available Delivery Jobs',
        description:
          'Confirmed trade orders appear as delivery jobs on your dashboard. Filter by route, load size, and vehicle type. Claim the jobs that fit your schedule.',
        details: [
          'Jobs appear instantly after trade',
          'Filter by distance & load',
          'No dispatch calls needed',
        ],
      },
      {
        number: '02',
        icon: <Search size={24} />,
        title: 'Quote Your Rate',
        description:
          'Submit your delivery rate for the route. If competitive, you\'re matched and both farmer and buyer are notified with your details and ETA.',
        details: [
          'Set your own delivery rates',
          'System compares active quotes',
          'Instant match notification',
        ],
      },
      {
        number: '03',
        icon: <Handshake size={24} />,
        title: 'Pick Up & Deliver',
        description:
          'Navigate to the farm gate for pickup with in-app directions. Log pickup confirmation, then deliver to the buyer\'s warehouse. Both parties track you live.',
        details: [
          'In-app navigation to farm',
          'Digital pickup receipt',
          'Real-time tracking for all',
        ],
      },
      {
        number: '04',
        icon: <CheckCircle size={24} />,
        title: 'Get Rated & Paid',
        description:
          'After successful delivery, payment is processed to your account and both parties rate your service. Top ratings unlock priority job matching and premium routes.',
        details: [
          'Same-day payment processing',
          'Build your delivery reputation',
          'Priority routing for top providers',
        ],
      },
    ],
  },
];

const HowItWorksSection: React.FC = () => {
  const [activeJourney, setActiveJourney] = useState(0);
  const [activeStep, setActiveStep]     = useState(0);

  const journey = journeys[activeJourney];

  return (
    <section id="how-it-works" className="hiw-section section-pad">
      <div className="hiw-bg-blob" />
      <div className="container">
        <ScrollReveal direction="up">
          <div className="text-center">
            <div className="section-tag">
              <Workflow size={13} /> How It Works
            </div>
            <h2 className="section-title">
              Your role. <span>Your journey.</span>
            </h2>
            <p className="section-desc">
              AgroLink guides every participant through a clear, 4-step journey —
              whether you're buying, selling, or delivering.
            </p>

            {/* Role tab switcher */}
            <div className="hiw-role-tabs">
              {journeys.map((j, i) => (
                <button
                  key={i}
                  className={`hiw-role-tab ${activeJourney === i ? 'active' : ''}`}
                  style={activeJourney === i
                    ? { background: `${j.color}22`, color: j.color, borderColor: `${j.color}55` }
                    : {}}
                  onClick={() => { setActiveJourney(i); setActiveStep(0); }}
                  id={`hiw-role-tab-${i}`}
                >
                  {j.emoji} {j.role}
                </button>
              ))}
            </div>

            <p className="hiw-role-tagline" style={{ color: journey.color }}>
              {journey.tagline}
            </p>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeJourney}
            className="hiw-layout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* Step selectors */}
            <div className="hiw-steps">
              {journey.steps.map((step, i) => (
                <motion.button
                  key={i}
                  id={`hiw-step-${activeJourney}-${i}`}
                  className={`hiw-step-btn ${activeStep === i ? 'active' : ''}`}
                  style={{ '--step-color': journey.color } as React.CSSProperties}
                  onClick={() => setActiveStep(i)}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="hiw-step-num" style={{ color: activeStep === i ? journey.color : undefined }}>
                    {step.number}
                  </div>
                  <div className="hiw-step-meta">
                    <div className="hiw-step-icon" style={{ color: activeStep === i ? journey.color : undefined }}>
                      {step.icon}
                    </div>
                    <div className="hiw-step-title">{step.title}</div>
                  </div>
                  {activeStep === i && (
                    <motion.div
                      className="hiw-step-progress"
                      layoutId="hiw-progress"
                      style={{ background: journey.color }}
                    />
                  )}
                  <ChevronRight size={16} className="hiw-step-chevron" />
                </motion.button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="hiw-detail-panel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  className="hiw-detail glass-strong"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="hiw-detail-num" style={{ color: journey.color }}>
                    {journey.steps[activeStep].number}
                  </div>

                  <div
                    className="hiw-detail-icon-wrap"
                    style={{ background: `${journey.color}22`, borderColor: `${journey.color}44`, color: journey.color }}
                  >
                    {journey.steps[activeStep].icon}
                  </div>

                  <h3 className="hiw-detail-title">{journey.steps[activeStep].title}</h3>
                  <p className="hiw-detail-desc">{journey.steps[activeStep].description}</p>

                  <ul className="hiw-detail-list">
                    {journey.steps[activeStep].details.map((d, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="hiw-detail-item"
                      >
                        <CheckCircle size={15} color={journey.color} />
                        <span>{d}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="hiw-dots">
                    {journey.steps.map((_, i) => (
                      <button
                        key={i}
                        className={`hiw-dot ${activeStep === i ? 'hiw-dot-active' : ''}`}
                        style={activeStep === i ? { background: journey.color } : {}}
                        onClick={() => setActiveStep(i)}
                        aria-label={`Step ${i + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HowItWorksSection;
