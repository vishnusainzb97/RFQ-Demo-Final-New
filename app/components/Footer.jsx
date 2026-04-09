'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-brand-mark" style={{ width: 24, height: 24, fontSize: '0.6rem', borderRadius: 'var(--radius-xs)' }}>R</div>
            RFQ Automation
          </div>
          <span className="footer-text">
            © {new Date().getFullYear()} Chemveda · Built with Next.js & n8n
          </span>
          <div className="footer-links">
            <a href="https://github.com/vishnusainzb97/RFQ-Chemveda-Demo" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#hero">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
