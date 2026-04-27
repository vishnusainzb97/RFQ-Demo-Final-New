'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rfq-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rfq-theme', next);
  };

  const go = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className={`nav ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="nav-inner">
        <a className="nav-brand" href="#" onClick={() => go('hero')}>
          <div className="nav-brand-mark">R</div>
          RFQ Automation
        </a>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {[
            ['How It Works', 'how-it-works'],
            ['Live Demo', 'demo'],
            ['Features', 'features'],
          ].map(([label, id]) => (
            <li key={id}>
              <a onClick={() => go(id)} role="button" tabIndex={0}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <motion.button
            className="theme-switch"
            onClick={toggle}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle theme"
            id="theme-toggle"
          >
            <motion.div
              className="theme-switch-thumb"
              animate={{ left: theme === 'dark' ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {theme === 'light' ? '☀' : '☾'}
            </motion.div>
          </motion.button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            id="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
