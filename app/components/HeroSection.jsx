'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { workflowSteps, scenarios } from '../data/mockData';

export default function HeroSection({ onTrigger, scenarioIndex }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const scenario = scenarios[scenarioIndex % scenarios.length];

  const runWorkflow = useCallback(() => {
    if (running) return;
    setRunning(true);
    setActiveStep(0);

    let step = 0;
    const advance = () => {
      if (step >= workflowSteps.length) {
        setTimeout(() => {
          setRunning(false);
          setActiveStep(-1);
          onTrigger();
        }, 500);
        return;
      }
      setActiveStep(step);
      setTimeout(() => {
        step++;
        setActiveStep(step);
        advance();
      }, workflowSteps[step].duration);
    };
    advance();
  }, [running, onTrigger]);

  const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-grid">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}
          >
            <motion.div className="hero-eyebrow" variants={fade} transition={{ type: 'spring', stiffness: 100 }}>
              <span className="hero-eyebrow-dot">⚡</span>
              n8n Email Workflow · Zero Manual Entry
            </motion.div>

            <motion.h1 className="hero-title" variants={fade} transition={{ type: 'spring', stiffness: 80 }}>
              Vendor emails in,<br /><em>structured data out.</em>
            </motion.h1>

            <motion.p className="hero-desc" variants={fade} transition={{ type: 'spring', stiffness: 80 }}>
              An n8n workflow monitors your inbox, reads entire email threads about
              chemical quotations, and auto-populates your procurement spreadsheet
              — no clicks, no uploads, no manual entry.
            </motion.p>

            <motion.div className="hero-actions" variants={fade} transition={{ type: 'spring', stiffness: 80 }}>
              <motion.button
                className="btn btn-accent"
                onClick={runWorkflow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="trigger-workflow"
                disabled={running}
              >
                {running ? '⟳ Running…' : '▶ Trigger Workflow'}
              </motion.button>
              <motion.button
                className="btn btn-ghost"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                How it works →
              </motion.button>
            </motion.div>

            {/* Scenario indicator */}
            <motion.div className="scenario-dots" variants={fade}>
              {scenarios.map((s, i) => (
                <div
                  key={`scenario-${s.rfpInfo.rfpCode}-${i}`}
                  className={`scenario-dot ${i === (scenarioIndex % scenarios.length) ? 'active' : ''}`}
                />
              ))}
              <span className="scenario-label">
                {scenario.rfpInfo.customer} — {scenario.rfpInfo.product}
              </span>
            </motion.div>
          </motion.div>

          {/* Right — Workflow */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.3 }}
          >
            <div className="hero-visual-card">
              <div className="hero-glow" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="wf-status-label">
                  <span className={`wf-status-dot ${running ? 'active' : ''}`} />
                  {running ? 'Workflow Running' : 'Workflow Ready'}
                </div>

                <div className="workflow-nodes">
                  {workflowSteps.map((step, i) => {
                    let status = 'waiting';
                    if (activeStep > i) status = 'completed';
                    else if (activeStep === i && running) status = 'active';

                    return (
                      <div key={step.id}>
                        <div className={`wf-node ${status === 'active' ? 'active' : ''} ${status === 'completed' ? 'completed' : ''}`}>
                          <div className={`wf-node-icon ${step.icon}`}>
                            {status === 'completed' ? '✓' : status === 'active' ? '⟳' : i + 1}
                          </div>
                          <div className="wf-node-body">
                            <div className="wf-node-title">{step.title}</div>
                            <div className="wf-node-sub">{step.sub}</div>
                          </div>
                          <span className={`wf-node-status ${status === 'active' ? 'running' : status === 'completed' ? 'done' : 'waiting'}`}>
                            {status === 'active' ? 'Running' : status === 'completed' ? 'Done' : 'Waiting'}
                          </span>
                        </div>
                        {i < workflowSteps.length - 1 && (
                          <div className={`wf-connector ${activeStep > i ? 'done' : activeStep === i && running ? 'active' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
