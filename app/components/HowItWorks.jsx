'use client';

import { motion } from 'framer-motion';
import { howItWorks } from '../data/mockData';

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">How It Works</div>
          <h2 className="section-heading">From inbox to spreadsheet, automatically</h2>
          <p className="section-desc">
            The entire pipeline runs without human intervention. A vendor sends a quote,
            and the data appears in your sheet within seconds.
          </p>
        </motion.div>

        <motion.div
          className="steps-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {howItWorks.map((step, i) => (
            <motion.div
              className="step-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 100 }}
            >
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
