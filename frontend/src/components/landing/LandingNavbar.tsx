import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import './LandingNavbar.css';

const navLinks = [
  { label: 'Features',    href: '#features'    },
  { label: 'About',       href: '#about'        },
  { label: 'How It Works',href: '#how-it-works' },
  { label: 'Testimonials',href: '#testimonials' },
  { label: 'FAQ',         href: '#faq'          },
  { label: 'Contact',     href: '#contact'      },
];

const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight active nav link via IntersectionObserver
  useEffect(() => {
    const sections = navLinks.map(l => document.querySelector(l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveLink(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    setActiveLink(href);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <a href="#hero" className="nav-logo" onClick={() => handleLinkClick('#hero')}>
          <div className="logo-icon">
            <Leaf size={20} strokeWidth={2.5} />
          </div>
          <span>Agro<strong>Link</strong></span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link ${activeLink === link.href ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="nav-cta">
          <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-links">
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`mobile-link ${activeLink === link.href ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-cta">
          <Link to="/login"    className="btn btn-outline" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
