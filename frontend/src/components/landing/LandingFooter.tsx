import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import './LandingFooter.css';

// Brand icons removed from lucide-react v1.x — using inline SVGs instead
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const footerLinks = {
  Marketplace: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Farmers',  href: '#features' },
    { label: 'For Buyers',   href: '#features' },
    { label: 'For Logistics',href: '#features' },
    { label: 'Pricing',      href: '#' },
  ],
  Company: [
    { label: 'About Us',   href: '#about' },
    { label: 'Blog',       href: '#' },
    { label: 'Careers',    href: '#' },
    { label: 'Press Kit',  href: '#' },
    { label: 'Contact',    href: '#contact' },
  ],
  Support: [
    { label: 'Farmer Guide',    href: '#' },
    { label: 'Buyer Guide',     href: '#' },
    { label: 'Logistics Guide', href: '#' },
    { label: 'FAQs',            href: '#faq' },
    { label: 'Report an Issue', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Trade Policy',     href: '#' },
    { label: 'Cookie Policy',    href: '#' },
  ],
};

const socials = [
  { icon: <XIcon />,        href: '#', label: 'X (Twitter)' },
  { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
  { icon: <GitHubIcon />,   href: '#', label: 'GitHub' },
  { icon: <YouTubeIcon />,  href: '#', label: 'YouTube' },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: 'smooth' });
};

const LandingFooter: React.FC = () => (
  <footer className="landing-footer">
    <div className="footer-top-gradient" />

    <div className="container">
      {/* Newsletter CTA banner */}
      <div className="footer-newsletter glass">
        <div className="footer-nl-left">
          <h3 className="footer-nl-title">Get the best harvest deals first</h3>
          <p className="footer-nl-sub">Weekly trade alerts, new buyer requests, and price reports for farmers. No spam, ever.</p>
        </div>
        <form
          className="footer-nl-form"
          onSubmit={e => e.preventDefault()}
          id="footer-newsletter-form"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="footer-nl-input"
            id="footer-nl-email"
          />
          <button type="submit" className="btn btn-primary" id="footer-nl-submit">
            Subscribe <ArrowRight size={15} />
          </button>
        </form>
      </div>

      {/* Links grid */}
      <div className="footer-links-grid">
        {/* Brand column */}
        <div className="footer-brand-col">
          <a href="#hero" className="footer-logo" onClick={() => scrollTo('#hero')}>
            <div className="footer-logo-icon">
              <Leaf size={18} strokeWidth={2.5} />
            </div>
            <span>Agro<strong>Link</strong></span>
          </a>
          <p className="footer-brand-desc">
            Sri Lanka's harvest marketplace — connecting farmers, bulk buyers,
            and logistics partners for direct, transparent trade. No middlemen.
          </p>
          {/* Socials */}
          <div className="footer-socials">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                className="footer-social-btn"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
          {/* Badges */}
          <div className="footer-badges">
            <div className="footer-badge-item">
              <span className="footer-badge-dot" />
              Verified Farmers
            </div>
            <div className="footer-badge-item">
              <span className="footer-badge-dot" />
              Secure Payments
            </div>
            <div className="footer-badge-item">
              <span className="footer-badge-dot" />
              Sri Lanka 🇱🇰
            </div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="footer-link-col">
            <h4 className="footer-link-heading">{category}</h4>
            <ul className="footer-link-list">
              {links.map(link => (
                <li key={link.label}>
                  {link.href.startsWith('#') && link.href.length > 1 ? (
                    <a
                      href={link.href}
                      className="footer-link"
                      onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href} className="footer-link">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} AgroLink Technologies Pvt Ltd. All rights reserved.
        </p>
        <div className="footer-bottom-links">
          <a href="#" className="footer-link footer-link-sm">Privacy</a>
          <a href="#" className="footer-link footer-link-sm">Terms</a>
          <a href="#" className="footer-link footer-link-sm">Cookies</a>
        </div>
        <div className="footer-made-with">
          Made with <span className="footer-heart">♥</span> for farmers worldwide
        </div>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
