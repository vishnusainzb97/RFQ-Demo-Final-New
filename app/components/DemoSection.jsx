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
          <div className="section-label">Executive Dashboard</div>
          <h2 className="section-heading">Multi-Vendor Quote Consolidation</h2>
          <p className="section-desc">
            Chemveda's engine intelligently links and groups competing inbound quotes natively into one high-level procurement dashboard.
          </p>
        </motion.div>

        {/* TOP LEVEL KPIs */}
        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="kpi-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Procurement Request</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0', color: 'var(--ink)' }}>{rfpInfo.rfpCode}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Active Client: {rfpInfo.customer}</div>
          </div>
          
          <div className="kpi-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Active Competitors</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0', color: 'var(--ink)' }}>5 Vendors</div>
            <div style={{ fontSize: '0.85rem', color: '#107c41' }}>Highest density matching</div>
          </div>

          <div className="kpi-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Fastest Lead Time</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0', color: 'var(--ink)' }}>1 Week</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Provided by <strong style={{color:'var(--ink)'}}>Avra, ABC</strong></div>
          </div>

          <div className="kpi-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Total Compounds</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0', color: 'var(--ink)' }}>4 Verified</div>
            <div style={{ fontSize: '0.85rem', color: '#107c41' }}>100% CAS Resolved</div>
          </div>
        </motion.div>

        {/* FULL WIDTH RESULTS TABLE */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.1 }}
           style={{ marginBottom: '3rem' }}
        >
          <div className="results-panel" style={{ width: '100%', maxWidth: '100%' }}>
            <div className="results-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="results-panel-title">
                📑 Consolidated Vendor Network Grid
                <span className="email-thread-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  Ready for Excel Export
                </span>
              </div>
              <motion.button
                  className="btn-sm btn-sm-accent primary-export-btn"
                  onClick={handleExport}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: '#107c41', color: 'white', border: 'none', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Generate Official Excel
              </motion.button>
            </div>

            <div style={{ overflowX: 'auto', padding: '1rem' }}>
              <table className="data-tbl" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px' }}>Compound Name</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>CAS No.</th>
                    <th style={{ padding: '12px' }}>Formula Qty</th>
                    <th style={{ padding: '12px' }}>Moles / M.Eq</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Quotes Available</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{r.chemicalName}</td>
                      <td style={{ padding: '12px' }}><span className={`cell-cat ${catCls(r.category)}`}>{r.category}</span></td>
                      <td className="cell-cas" style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>{r.casNo || 'N/A'}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{r.qty} {r.unit}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{r.moles ? `${r.moles}m` : '-'} / {r.moleEq} eq</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{ 
                          background: r.vendorQuotes?.length > 2 ? '#dcfce7' : '#fef9c3', 
                          color: r.vendorQuotes?.length > 2 ? '#166534' : '#854d0e',
                          padding: '6px 14px', 
                          borderRadius: '16px', 
                          fontSize: '0.85rem',
                          fontWeight: '700'
                        }}>
                          {r.vendorQuotes?.length || 0} Quotes
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                <div className="tbl-search" style={{ margin: 0 }}>
                  <span className="tbl-search-icon">⌕</span>
                  <input
                    placeholder="Refine compound search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '250px' }}
                  />
                </div>
            </div>
          </div>
        </motion.div>


        {/* RELOCATED EMAIL BOTTOM SECTION */}
        <motion.div
            className="email-thread"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ width: '100%', maxWidth: '100%' }}
        >
            <div className="email-thread-header" style={{ background: '#f8fafc' }}>
              <div className="email-thread-title" style={{ fontSize: '1.2rem' }}>
                📨 Communications Audit Log
              </div>
            </div>
            <div className="email-thread-msgs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', padding: '1.5rem', background: '#fff' }}>
              {emailThread.map((msg, i) => (
                <div
                  className="email-msg"
                  key={msg.id}
                  style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', background: '#fafafa', boxShadow: activeEmail === i ? '0 0 0 2px var(--accent)' : 'none', cursor: 'pointer' }}
                  onClick={() => setActiveEmail(i)}
                >
                  <div className="email-msg-head" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className={`email-avatar ${msg.role === 'buyer' ? 'buyer' : 'vendor'}`}>
                      {msg.sender.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="email-meta">
                      <div className="email-sender">
                        <strong style={{ color: '#1e293b' }}>{msg.sender}</strong>
                        <span className={`email-sender-tag ${msg.role === 'buyer' ? 'buyer' : 'vendor'}`} style={{ marginLeft: '8px' }}>
                          {msg.role === 'buyer' ? 'Client Request' : 'Vendor Quote'}
                        </span>
                      </div>
                      <div className="email-time" style={{ fontSize: '0.8rem', color: '#64748b' }}>{msg.company} • {msg.time}</div>
                    </div>
                  </div>
                  <div className="email-body" style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#334155' }}>{renderBody(msg)}</div>
                </div>
              ))}
            </div>
        </motion.div>

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
