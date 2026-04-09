'use client';

import { motion } from 'framer-motion';
import { features } from '../data/mockData';

const iconMap = {
  email: '📨', parse: '🧠', match: '🔬', sheet: '📊', lock: '🔒', zap: '⚡',
};

export default function FeaturesSection() {
  return (
    <section className="section features-section" id="features">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Capabilities</div>
          <h2 className="section-heading">Built for pharmaceutical procurement teams</h2>
          <p className="section-desc">
            Every part of this workflow was designed for the specific needs of
            chemical quotation processing — not generic document parsing.
          </p>
        </motion.div>

        <div className="bento-grid">
          {features.map((f, i) => {
            const sizeClass =
              f.size === 'lg' ? 'bento-card-lg' :
              f.size === 'mid' ? 'bento-card-mid' : 'bento-card-sm';

            return (
              <motion.div
                className={`bento-card ${sizeClass}`}
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 100 }}
              >
                <div className={`bento-icon bento-icon-${f.color}`}>
                  {iconMap[f.icon] || '⚙'}
                </div>
                <h3 className="bento-title">{f.title}</h3>
                <p className="bento-desc">{f.desc}</p>
                {f.visual && (
                  <div className="bento-visual">
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{f.visual}</pre>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
