'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import DemoSection from './components/DemoSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

const trustItems = [
  { key: 'n8n', icon: '⚡', label: 'n8n Workflow Engine' },
  { key: 'local', icon: '🔒', label: 'Runs Locally' },
  { key: 'excel', icon: '📊', label: 'Auto Excel Export' },
  { key: 'cas', icon: '🧪', label: 'CAS Matching' },
  { key: 'email', icon: '📧', label: 'Email-Triggered' },
];

export default function Home() {
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const handleTrigger = useCallback(() => {
    setScenarioIndex(prev => prev + 1);
    setTimeout(() => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection onTrigger={handleTrigger} scenarioIndex={scenarioIndex} />

        {/* Trust Bar */}
        <div className="trust-bar">
          <div className="container">
            <div className="trust-bar-inner">
              {trustItems.map((item, i) => (
                <motion.div
                  className="trust-item"
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="trust-icon">{item.icon}</div>
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <HowItWorks />
        <DemoSection scenarioIndex={scenarioIndex} />
        <FeaturesSection />

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              className="cta-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cta-label">Get Started</div>
              <h2 className="cta-title">Ready to automate your RFQ workflow?</h2>
              <p className="cta-desc">
                Deploy this n8n workflow to your infrastructure and start
                converting vendor emails into structured procurement data.
              </p>
              <motion.a
                className="btn-white"
                href="https://github.com/vishnusainzb97/RFQ-Demo-Final-New"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View on GitHub →
              </motion.a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
