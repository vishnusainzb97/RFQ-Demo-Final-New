'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scenarios } from '../data/mockData';
import { exportToExcel } from '../utils/exportExcel';

export default function DemoSection({ scenarioIndex }) {
  const scenario = scenarios[scenarioIndex % scenarios.length];
  const { rfpInfo, emailThread, tableData: initialData } = scenario;

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [activeEmail, setActiveEmail] = useState(0);

  const [prevIdx, setPrevIdx] = useState(scenarioIndex);
  if (scenarioIndex !== prevIdx) {
    setPrevIdx(scenarioIndex);
    setData(scenario.tableData);
    setSearch('');
    setActiveEmail(0);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(r =>
      r.chemicalName?.toLowerCase().includes(q) ||
      r.casNo?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    );
  }, [data, search]);

  const handleExport = async () => {
    try {
      await exportToExcel(rfpInfo, data, emailThread);
      setToast('Premium Excel downloaded successfully!');
    } catch (err) {
      console.error(err);
      setToast('Error generating Excel file.');
    }
    setTimeout(() => setToast(null), 3000);
  };

  const catColor = (c) => {
    if (!c) return 'var(--ink-20)';
    const l = c.toLowerCase();
    if (l.includes('ksm') || l.includes('int')) return 'var(--blue)';
    if (l === 'reagent') return 'var(--purple)';
    if (l === 'solvent') return 'var(--warn)';
    return 'var(--ink-20)';
  };

  const renderBody = (msg) => {
    let html = msg.body.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br/>');
    (msg.highlights || []).forEach(h => {
      const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(
        new RegExp(escaped, 'g'),
        `<span class="hl">${h}</span>`
      );
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <section className="demo-section" id="demo">
      <div className="container">

        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem' }}
        >
          <div className="section-label">Executive Dashboard</div>
          <h2 className="section-heading">Multi-Vendor Quote Intelligence</h2>
          <p className="section-desc">
            Chemveda&apos;s engine intelligently links and groups competing inbound quotes
            natively into one high-level procurement dashboard.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="kpi-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-dot blue" />
              <div className="kpi-label">Procurement Request</div>
            </div>
            <div className="kpi-value">{rfpInfo.rfpCode}</div>
            <div className="kpi-sub blue">Active Client: {rfpInfo.customer}</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-dot green" />
              <div className="kpi-label">Active Competitors</div>
            </div>
            <div className="kpi-value">5 Vendors</div>
            <div className="kpi-sub green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Highest density matching
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-dot amber" />
              <div className="kpi-label">Fastest Lead Time</div>
            </div>
            <div className="kpi-value">1 Week</div>
            <div className="kpi-sub amber">Provided by <strong>Avra, ABC</strong></div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-dot purple" />
              <div className="kpi-label">Total Compounds</div>
            </div>
            <div className="kpi-value">4 Verified</div>
            <div className="kpi-sub purple">100% CAS Resolved</div>
          </div>
        </motion.div>

        {/* Vendor Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="vendor-table-card">
            {/* Header */}
            <div className="vendor-table-header">
              <h3 className="vendor-table-title">
                📑 Consolidated Vendor Network Grid
                <span className="vendor-table-badge">Live Data</span>
              </h3>
              <motion.button
                className="btn-export"
                onClick={handleExport}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="16" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Export Official Excel
              </motion.button>
            </div>

            {/* Search - above table */}
            <div className="vendor-table-search">
              <div className="vendor-search-wrap">
                <span className="vendor-search-icon">⌕</span>
                <input
                  className="vendor-search-input"
                  placeholder="Refine compound search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Compound & Structure</th>
                    <th>CAS Registry</th>
                    <th>Base Density</th>
                    <th>Target Scale</th>
                    <th>Mole Distribution</th>
                    <th style={{ textAlign: 'center' }}>Quote Density</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const qCount = r.vendorQuotes?.length || 0;
                    const maxQuotes = 5;
                    const fillPercent = (qCount / maxQuotes) * 100;

                    return (
                      <tr key={r.casNo || r.chemicalName}>
                        <td>
                          <div className="cell-compound-name">{r.chemicalName}</div>
                          <span
                            className="cell-category-badge"
                            style={{
                              color: catColor(r.category),
                              background: `color-mix(in srgb, ${catColor(r.category)} 12%, transparent)`
                            }}
                          >
                            {r.category}
                          </span>
                        </td>
                        <td>
                          <div className="cell-cas">
                            <svg className="cell-cas-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {r.casNo || 'N/A'}
                          </div>
                        </td>
                        <td>
                          {r.density
                            ? <span className="cell-density">{r.density} g/mL</span>
                            : <span className="cell-density-unknown">Unknown</span>
                          }
                        </td>
                        <td>
                          <div className="cell-target-scale">{r.qty} {r.unit}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="cell-mole-value">{r.moleEq} eq</div>
                            <div className="cell-mole-bar">
                              <div
                                className="cell-mole-bar-fill"
                                style={{ width: r.moleEq > 1 ? '100%' : '50%' }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div className={`cell-quote-header ${qCount >= 3 ? 'high' : 'low'}`}>
                              <span>{qCount} Vendors</span>
                              <span>{Math.round(fillPercent)}%</span>
                            </div>
                            <div className="cell-quote-bar">
                              <div
                                className={`cell-quote-bar-fill ${qCount >= 3 ? 'high' : 'low'}`}
                                style={{ width: `${fillPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Email Communications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="email-section-header">
            <div className="email-section-icon">📨</div>
            <h3 className="email-section-title">Communications Audit Log</h3>
          </div>

          <div className="email-grid">
            {emailThread.map((msg) => (
              <div
                key={msg.id}
                className={`email-card ${activeEmail === emailThread.indexOf(msg) ? 'active' : ''}`}
                onClick={() => setActiveEmail(emailThread.indexOf(msg))}
              >
                <div className={`email-card-badge ${msg.role}`}>
                  {msg.role === 'buyer' ? 'Client Request' : 'Vendor Quote'}
                </div>

                <div className="email-card-meta">
                  <div className={`email-card-avatar ${msg.role}`}>
                    {msg.sender.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <div className="email-card-sender">{msg.sender}</div>
                    <div className="email-card-info">{msg.company} • {msg.time}</div>
                  </div>
                </div>

                <div className="email-card-body">
                  {renderBody(msg)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
