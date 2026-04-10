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
      await exportToExcel(rfpInfo, data);
      setToast('Premium Excel downloaded successfully!');
    } catch (err) {
      console.error(err);
      setToast('Error generating Excel file.');
    }
    setTimeout(() => setToast(null), 3000);
  };

  const catCls = (c) => {
    if (!c) return 'cell-cat-general';
    const l = c.toLowerCase();
    if (l.includes('ksm') || l.includes('int')) return 'cell-cat-ksm';
    if (l === 'reagent') return 'cell-cat-reagent';
    if (l === 'solvent') return 'cell-cat-solvent';
    return 'cell-cat-general';
  };

  const renderBody = (msg) => {
    let html = msg.body.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
    (msg.highlights || []).forEach(h => {
      const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp(escaped, 'g'), `<span class="hl">${h}</span>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <section className="section demo-section" id="demo">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Live Demo</div>
          <h2 className="section-heading">Multi-Vendor Quote Consolidation</h2>
          <p className="section-desc">
            Chemveda's engine securely monitors multiple independent vendor emails, automatically grouping competing quotes by verified CAS numbers into a single master summary.
          </p>
        </motion.div>

        <div className="demo-grid">
          {/* Left — Email */}
          <motion.div
            className="demo-left"
            key={`emails-${scenarioIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="email-thread">
              <div className="email-thread-header">
                <div className="email-thread-title">
                  📨 Incoming Vendor Quotes
                </div>
              </div>
              <div className="email-thread-msgs">
                {emailThread.map((msg, i) => (
                  <div
                    className={`email-msg ${activeEmail === i ? 'highlighted' : ''}`}
                    key={msg.id}
                    onClick={() => setActiveEmail(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="email-msg-head">
                      <div className={`email-avatar ${msg.role === 'buyer' ? 'buyer' : 'vendor'}`}>
                        {msg.sender.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="email-meta">
                        <div className="email-sender">
                          {msg.sender}
                          <span className={`email-sender-tag ${msg.role === 'buyer' ? 'buyer' : 'vendor'}`}>{msg.role === 'buyer' ? 'Client' : 'Supplier'}</span>
                        </div>
                        <div className="email-time">{msg.company} • {msg.time}</div>
                      </div>
                    </div>
                    <div className="email-body">{renderBody(msg)}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Results */}
          <motion.div
            key={`results-${scenarioIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="results-panel">
              <div className="results-panel-header">
                <div className="results-panel-title">
                  📑 Extracted Quotation Data
                  <span className="email-thread-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                    Ready for Export
                  </span>
                </div>
              </div>

              {/* RFP Meta */}
              <div className="rfp-meta">
                <div className="rfp-field"><div className="rfp-field-label">RFP Code</div><div className="rfp-field-value">{rfpInfo.rfpCode}</div></div>
                <div className="rfp-field"><div className="rfp-field-label">Customer</div><div className="rfp-field-value">{rfpInfo.customer}</div></div>
                <div className="rfp-field"><div className="rfp-field-label">Vendors Scanned</div><div className="rfp-field-value">4 Active Suppliers</div></div>
              </div>

              {/* Controls */}
              <div className="tbl-controls">
                <div className="tbl-search">
                  <span className="tbl-search-icon">⌕</span>
                  <input
                    placeholder="Search chemical..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <motion.button
                  className="btn-sm btn-sm-accent primary-export-btn"
                  onClick={handleExport}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: '#107c41', color: 'white', border: 'none', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Generate Official Excel
                </motion.button>
              </div>

              {/* Minimal Table Overview */}
              <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                <p style={{fontSize: '0.8rem', color: '#666', margin: '0 0 10px 10px'}}>* Showing simplified overview. Grouped competitor insights available in Excel.</p>
                <table className="data-tbl">
                  <thead>
                    <tr>
                      <th>Chemical / Substance</th>
                      <th>CAS No.</th>
                      <th style={{ textAlign: 'center' }}>Quotes Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 500 }}>
                          {r.chemicalName}
                          <br/><span className={`cell-cat ${catCls(r.category)}`} style={{marginTop: '4px', display:'inline-block'}}>{r.category}</span>
                        </td>
                        <td className="cell-cas" style={{ verticalAlign: 'middle' }}>{r.casNo || 'N/A'}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <span style={{ 
                            background: r.vendorQuotes?.length > 2 ? '#dcfce7' : '#fef9c3', 
                            color: r.vendorQuotes?.length > 2 ? '#166534' : '#854d0e',
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            {r.vendorQuotes?.length || 0} Quotes
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
