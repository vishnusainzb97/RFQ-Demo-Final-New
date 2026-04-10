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
    if (!c) return '#94a3b8'; // general
    const l = c.toLowerCase();
    if (l.includes('ksm') || l.includes('int')) return '#3b82f6';
    if (l === 'reagent') return '#a855f7';
    if (l === 'solvent') return '#f59e0b';
    return '#94a3b8';
  };

  const renderBody = (msg) => {
    let html = msg.body.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
    (msg.highlights || []).forEach(h => {
      const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp(escaped, 'g'), `<span style="background: rgba(16, 124, 65, 0.15); color: #0f6132; font-weight: 600; padding: 2px 6px; border-radius: 4px;">${h}</span>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <section className="section demo-section" id="demo" style={{ background: 'linear-gradient(140deg, #f8fafc 0%, #f1f5f9 100%)', padding: '6rem 0' }}>
      <div className="container">
        
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem', textAlign: 'center' }}
        >
          <div className="section-label" style={{ display: 'inline-block', marginBottom: '1rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '6px 14px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.85rem' }}>Executive Dashboard</div>
          <h2 className="section-heading" style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Multi-Vendor Quote Intelligence</h2>
          <p className="section-desc" style={{ maxWidth: '700px', margin: '0 auto', color: '#64748b', fontSize: '1.1rem' }}>
            Chemveda's engine intelligently links and groups competing inbound quotes natively into one high-level procurement dashboard.
          </p>
        </motion.div>

        {/* TOP LEVEL KPIs - Glassmorphism */}
        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Procurement Request</div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{rfpInfo.rfpCode}</div>
            <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '6px', fontWeight: 600 }}>Active Client: {rfpInfo.customer}</div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Active Competitors</div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>5 Vendors</div>
            <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems:'center', gap: '4px' }}>
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Highest density matching
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Fastest Lead Time</div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>1 Week</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>Provided by <strong style={{color:'#475569'}}>Avra, ABC</strong></div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Total Compounds</div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>4 Verified</div>
            <div style={{ fontSize: '0.85rem', color: '#8b5cf6', marginTop: '6px', fontWeight: 600 }}>100% CAS Resolved</div>
          </div>
        </motion.div>

        {/* FULL WIDTH RESULTS TABLE */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.15 }}
           style={{ marginBottom: '4rem' }}
        >
          <div style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  📑 Consolidated Vendor Network Grid
                  <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>Live Data</span>
                </h3>
              </div>
              <motion.button
                  onClick={handleExport}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(16, 124, 65, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: '#107c41', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.4rem', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Export Official Excel
              </motion.button>
            </div>

            {/* Table Area */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 32px' }}>Compound & Structure</th>
                    <th style={{ padding: '16px' }}>CAS Registry</th>
                    <th style={{ padding: '16px' }}>Base Density</th>
                    <th style={{ padding: '16px' }}>Target Scale</th>
                    <th style={{ padding: '16px' }}>Mole Distribution</th>
                    <th style={{ padding: '16px', textAlign: 'center' }}>Quote Density</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => {
                    const qCount = r.vendorQuotes?.length || 0;
                    const maxQuotes = 5;
                    const fillPercent = (qCount / maxQuotes) * 100;
                    
                    return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', ':hover': { background: '#f8fafc' } }}>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', marginBottom: '6px' }}>{r.chemicalName}</div>
                        <span style={{ 
                          fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px',
                          color: catCls(r.category), background: `${catCls(r.category)}15`
                        }}>{r.category}</span>
                      </td>
                      <td style={{ padding: '20px', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, color: '#475569' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          {r.casNo || 'N/A'}
                        </div>
                      </td>
                      <td style={{ padding: '20px', color: '#64748b', fontWeight: 500 }}>
                        {r.density ? `${r.density} g/mL` : <span style={{color: '#cbd5e1'}}>Unknown</span>}
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{r.qty} {r.unit}</div>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ color: '#0f172a', fontWeight: 600, width: '45px' }}>{r.moleEq} eq</div>
                          {/* Visual representation of Moles Data Bar */}
                          <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', position: 'relative', width: '60px' }}>
                             <div style={{ position:'absolute', top:0, left:0, bottom:0, background: '#3b82f6', borderRadius: '3px', width: r.moleEq > 1 ? '100%' : '50%'}}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '20px' }}>
                        {/* Quote Density Visual Bar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: qCount >= 3 ? '#10b981' : '#f59e0b' }}>
                            <span>{qCount} Vendors</span>
                            <span>{Math.round(fillPercent)}%</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: qCount >= 3 ? '#10b981' : '#f59e0b', width: `${fillPercent}%`, borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Search Footer */}
            <div style={{ padding: '1.25rem 2rem', background: '#f8fafc', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>⌕</span>
                  <input
                    placeholder="Refine compound search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff', fontSize: '0.9rem' }}
                  />
                </div>
            </div>
          </div>
        </motion.div>


        {/* RELOCATED EMAIL BOTTOM SECTION - Modern Grid */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '12px' }}>
               <div style={{ background: '#3b82f6', color: '#fff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📨</div>
               <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Communications Audit Log</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {emailThread.map((msg, i) => (
                <div
                  key={msg.id}
                  style={{ 
                    border: activeEmail === i ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    padding: '1.5rem', 
                    background: '#ffffff', 
                    boxShadow: activeEmail === i ? '0 12px 30px rgba(59,130,246,0.15)' : '0 4px 15px rgba(0,0,0,0.03)', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onClick={() => setActiveEmail(i)}
                  onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'translateY(-4px)';
                     e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'none';
                     e.currentTarget.style.boxShadow = activeEmail === i ? '0 12px 30px rgba(59,130,246,0.15)' : '0 4px 15px rgba(0,0,0,0.03)';
                  }}
                >
                  {/* Badge */}
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: msg.role === 'buyer' ? '#f1f5f9' : '#fff7ed', color: msg.role === 'buyer' ? '#475569' : '#ea580c', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                     {msg.role === 'buyer' ? 'Client Request' : 'Vendor Quote'}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
                    <div style={{ 
                        width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700,
                        background: msg.role === 'buyer' ? '#334155' : '#ea580c', color: '#fff'
                      }}>
                      {msg.sender.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>{msg.sender}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{msg.company} • {msg.time}</div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#475569' }}>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
