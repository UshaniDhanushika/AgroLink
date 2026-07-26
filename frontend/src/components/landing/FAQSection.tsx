import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Plus } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './FAQSection.css';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  /* ── For Farmers ── */
  {
    category: 'For Farmers',
    question: 'How do I find buyer requests for my crops?',
    answer:
      'After registering as a farmer, go to the "Browse Requests" tab on your dashboard. You\'ll see all open buyer requests filtered by your crop type and region. You can also set price alerts — we notify you the moment a buyer posts a request that meets your target price.',
  },
  {
    category: 'For Farmers',
    question: 'Is there any commission charged on my sale?',
    answer:
      'AgroLink charges a small platform fee of 2% on successfully completed trades. This is far less than the 20–40% cut typically taken by traders and brokers. There are no listing fees, no monthly charges — you only pay when you actually sell.',
  },
  {
    category: 'For Farmers',
    question: 'When do I get paid after delivery?',
    answer:
      'Payment is released to your registered bank account or e-wallet within 24 hours after the buyer confirms receipt of your produce. AgroLink holds the payment in escrow during transport to protect both parties. You\'ll receive a payment notification and digital receipt immediately.',
  },
  /* ── For Buyers ── */
  {
    category: 'For Buyers',
    question: 'How do I post a harvest request?',
    answer:
      'Click "Post a Request" on your dashboard. Fill in the crop type, quantity you need, your target price per kg, quality grade, and required delivery date. Your request goes live instantly and is matched to verified farmers who grow that crop in nearby regions.',
  },
  {
    category: 'For Buyers',
    question: 'Can I verify the quality of produce before confirming?',
    answer:
      'Yes. Farmer profiles show their quality ratings, past trade history, and produce grades. When a farmer submits a supply offer, they attach photos and their quality declaration. For high-value orders, our platform supports requesting a third-party quality inspection before delivery confirmation.',
  },
  {
    category: 'For Buyers',
    question: 'What if the produce doesn\'t meet the agreed quality on delivery?',
    answer:
      'If the produce does not match the agreed grade on delivery, you can raise a quality dispute within 12 hours of receipt. AgroLink\'s dispute resolution team reviews the case within 24 hours. Payment is only released once the dispute is resolved — protecting your purchase completely.',
  },
  /* ── For Logistics ── */
  {
    category: 'For Logistics',
    question: 'How do logistics providers get delivery jobs?',
    answer:
      'After registering as a logistics provider and completing vehicle verification, confirmed trade orders appear as delivery jobs on your dashboard. You can filter by route, load size, and vehicle type. Submit your rate quote and if matched, the job is yours — no phone calls, no middlemen.',
  },
  {
    category: 'For Logistics',
    question: 'What vehicles can I register on AgroLink?',
    answer:
      'AgroLink supports all types of agricultural transport vehicles: lorries, pickups, refrigerated vans, tuk-tuks for short hauls, and large container trucks for bulk orders. Each vehicle is verified with RC book and insurance before you receive your first job.',
  },
  /* ── General ── */
  {
    category: 'General',
    question: 'Is AgroLink available across Sri Lanka?',
    answer:
      'Yes, AgroLink currently operates across all 9 provinces of Sri Lanka. Our logistics network covers major agricultural zones including Nuwara Eliya, Matale, Polonnaruwa, Kurunegala, and Vavuniya, with delivery routes to Colombo, Kandy, Galle, and all major cities.',
  },
  {
    category: 'General',
    question: 'Is my personal and trade data secure?',
    answer:
      'All data on AgroLink is encrypted at rest and in transit. We never sell your data to third parties. Farmer bank details and buyer procurement details are stored securely and only used for payment processing. You can request data export or deletion at any time through your account settings.',
  },
];

const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];

const categoryColors: Record<string, string> = {
  'For Farmers':    '#6dbf67',
  'For Buyers':     '#f5c842',
  'For Logistics':  '#87ceeb',
  'General':        '#a8e6cf',
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  return (
    <section id="faq" className="faq-section section-pad">
      <div className="faq-bg-blob" />
      <div className="container">
        <ScrollReveal direction="up">
          <div className="text-center">
            <div className="section-tag">
              <HelpCircle size={13} /> FAQ
            </div>
            <h2 className="section-title">
              Questions? <span>We've got answers.</span>
            </h2>
            <p className="section-desc">
              Everything farmers, buyers, and logistics providers need to know
              before joining AgroLink. Can't find what you need? Chat with us anytime.
            </p>
          </div>
        </ScrollReveal>

        {/* Category filter */}
        <ScrollReveal direction="up" delay={50}>
          <div className="faq-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`faq-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                style={activeCategory === cat && cat !== 'All'
                  ? { background: `${categoryColors[cat]}18`, color: categoryColors[cat], borderColor: `${categoryColors[cat]}44` }
                  : {}}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              >
                {cat === 'For Farmers' ? '🌾 ' : cat === 'For Buyers' ? '🛒 ' : cat === 'For Logistics' ? '🚛 ' : ''}{cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* FAQ accordion */}
        <div className="faq-list">
          <AnimatePresence>
            {filtered.map((faq, i) => (
              <motion.div
                key={`${activeCategory}-${i}`}
                className={`faq-item ${openIndex === i ? 'open' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                id={`faq-item-${i}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="faq-q-icon"><Plus size={16} /></span>
                  <span className="faq-q-text">{faq.question}</span>
                  <span
                    className="faq-cat-badge"
                    style={{
                      background: `${categoryColors[faq.category] || '#6dbf67'}18`,
                      color: categoryColors[faq.category] || '#6dbf67',
                      border: `1px solid ${categoryColors[faq.category] || '#6dbf67'}33`,
                    }}
                  >
                    {faq.category}
                  </span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <p className="faq-answer-text">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA below FAQ */}
        <ScrollReveal direction="up" delay={100}>
          <div className="faq-cta glass">
            <HelpCircle size={24} color="#6dbf67" />
            <div>
              <div className="faq-cta-title">Still have questions?</div>
              <div className="faq-cta-sub">Our team is available Mon–Sat, 7am–7pm Sri Lanka time.</div>
            </div>
            <button className="btn btn-primary faq-cta-btn" id="faq-chat-btn">
              Chat With Us
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
