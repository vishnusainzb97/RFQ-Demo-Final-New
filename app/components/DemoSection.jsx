'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scenarios } from '../data/mockData';
import * as XLSX from 'xlsx';

export default function DemoSection({ scenarioIndex }) {
  const scenario = scenarios[scenarioIndex % scenarios.length];
  const { rfpInfo, emailThread, tableData: initialData } = scenario;

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [editCell, setEditCell] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [toast, setToast] = useState(null);
  const [activeEmail, setActiveEmail] = useState(1);

  // Reset data when scenario changes
  const [prevIdx, setPrevIdx] = useState(scenarioIndex);
  if (scenarioIndex !== prevIdx) {
    setPrevIdx(scenarioIndex);
    setData(scenario.tableData);
    setSearch('');
    setSortCol(null);
    setActiveEmail(1);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(r =>
      r.chemicalName.toLowerCase().includes(q) ||
      r.casNumber.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.stage.toLowerCase().includes(q)
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      av = String(av).toLowerCase(); bv = String(bv).toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortCol, sortDir]);

  const onSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const startEdit = (id, col, val) => { setEditCell({ id, col }); setEditVal(String(val)); };
  const saveEdit = () => {
    if (!editCell) return;
    setData(prev => prev.map(r => {
      if (r.id !== editCell.id) return r;
      const numCols = ['qty', 'unitCost', 'totalCost', 'pctTotal'];
      const v = numCols.includes(editCell.col) ? (parseFloat(editVal) || 0) : editVal;
      const upd = { ...r, [editCell.col]: v };
      if (editCell.col === 'qty' || editCell.col === 'unitCost')
        upd.totalCost = parseFloat((upd.qty * upd.unitCost).toFixed(2));
      return upd;
    }));
    setEditCell(null);
  };
  const onKey = (e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditCell(null); };

  const totalCost = data.reduce((s, r) => s + r.totalCost, 0);
  const stages = [...new Set(data.map(r => r.stage))].length;

  const exportXlsx = useCallback(() => {
    const rows = [
      ['RFQ Automation — Extracted Data'], [],
      ['Date', rfpInfo.date, '', 'Customer', rfpInfo.customer],
      ['RFP Code', rfpInfo.rfpCode, '', 'Product', rfpInfo.product],
      ['Quantity', rfpInfo.quantity], [],
      ['Stage', 'Category', 'Chemical', 'CAS No.', 'Qty', 'Units', 'Rate (₹)', 'Total (₹)', 'Source', 'Country', 'Lead Time'],
      ...data.map(r => [r.stage, r.categoryLabel, r.chemicalName, r.casNumber, r.qty, r.units, r.unitCost, r.totalCost, r.source, r.country, r.leadTime]),
      [], ['', '', '', '', '', '', 'TOTAL', totalCost.toFixed(2)],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 14 }, { wch: 8 }, { wch: 6 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws, rfpInfo.rfpCode);
    XLSX.writeFile(wb, `${rfpInfo.rfpCode}_RFQ_Export.xlsx`);
    setToast('Excel exported successfully');
    setTimeout(() => setToast(null), 3000);
  }, [data, totalCost, rfpInfo]);

  const fmt = (v) => typeof v === 'number' ? '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 0 }) : v;
  const catCls = (c) => {
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

  const cols = [
    { key: 'stage', label: 'Stage' },
    { key: 'categoryLabel', label: 'Type' },
    { key: 'chemicalName', label: 'Chemical Name' },
    { key: 'casNumber', label: 'CAS No.' },
    { key: 'qty', label: 'Qty' },
    { key: 'unitCost', label: 'Rate (₹)' },
    { key: 'totalCost', label: 'Total (₹)' },
    { key: 'leadTime', label: 'Lead Time' },
  ];

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
          <h2 className="section-heading">See the workflow in action</h2>
          <p className="section-desc">
            Left: the email thread the workflow reads. Right: the structured output it produces.
            Hit "Trigger Workflow" above to cycle through different scenarios.
          </p>
        </motion.div>

        <div className="demo-grid">
          {/* Left — Email Thread */}
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
                  📨 Email Thread
                  <span className="email-thread-badge">{emailThread.length} messages</span>
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
                      <div className={`email-avatar ${msg.role}`}>
                        {msg.sender.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="email-meta">
                        <div className="email-sender">
                          {msg.sender}
                          <span className={`email-sender-tag ${msg.role}`}>
                            {msg.role === 'vendor' ? 'Vendor' : 'Buyer'}
                          </span>
                        </div>
                        <div className="email-time">{msg.company} · {msg.time}</div>
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
                  📊 Auto-Generated Output
                  <span className="email-thread-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                    Live
                  </span>
                </div>
              </div>

              {/* RFP Meta */}
              <div className="rfp-meta">
                <div className="rfp-field"><div className="rfp-field-label">RFP Code</div><div className="rfp-field-value">{rfpInfo.rfpCode}</div></div>
                <div className="rfp-field"><div className="rfp-field-label">Customer</div><div className="rfp-field-value">{rfpInfo.customer}</div></div>
                <div className="rfp-field"><div className="rfp-field-label">Product</div><div className="rfp-field-value">{rfpInfo.product}</div></div>
                <div className="rfp-field"><div className="rfp-field-label">Date</div><div className="rfp-field-value">{rfpInfo.date}</div></div>
                <div className="rfp-field"><div className="rfp-field-label">Quantity</div><div className="rfp-field-value">{rfpInfo.quantity}</div></div>
                <div className="rfp-field"><div className="rfp-field-label">Stages</div><div className="rfp-field-value">{stages}</div></div>
              </div>

              {/* Stats */}
              <div className="stats-row">
                <div className="stat-pill">
                  <div className="stat-pill-value">{data.length}</div>
                  <div className="stat-pill-label">Items Extracted</div>
                </div>
                <div className="stat-pill">
                  <div className="stat-pill-value">{stages}</div>
                  <div className="stat-pill-label">Synthesis Stages</div>
                </div>
                <div className="stat-pill">
                  <div className="stat-pill-value">{fmt(totalCost)}</div>
                  <div className="stat-pill-label">Estimated Cost</div>
                </div>
              </div>

              {/* Controls */}
              <div className="tbl-controls">
                <div className="tbl-search">
                  <span className="tbl-search-icon">⌕</span>
                  <input
                    placeholder="Search chemicals, CAS..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    id="search-input"
                  />
                </div>
                <motion.button
                  className="btn-sm btn-sm-accent"
                  onClick={exportXlsx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="export-btn"
                >
                  ↓ Export .xlsx
                </motion.button>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table className="data-tbl" id="rfq-table">
                  <thead>
                    <tr>
                      {cols.map(c => (
                        <th key={c.key} onClick={() => onSort(c.key)} className={sortCol === c.key ? 'sorted' : ''}>
                          {c.label}
                          <span className="sort-arrow">{sortCol === c.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((r) => (
                      <tr key={r.id}>
                        <td className="cell-stage">{r.stage}</td>
                        <td><span className={`cell-cat ${catCls(r.categoryLabel)}`}>{r.categoryLabel}</span></td>
                        <td className="cell-editable" onClick={() => startEdit(r.id, 'chemicalName', r.chemicalName)}>
                          {editCell?.id === r.id && editCell?.col === 'chemicalName'
                            ? <input className="cell-input" value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={saveEdit} onKeyDown={onKey} autoFocus />
                            : r.chemicalName}
                        </td>
                        <td className="cell-cas">{r.casNumber}</td>
                        <td className="cell-editable" onClick={() => startEdit(r.id, 'qty', r.qty)}>
                          {editCell?.id === r.id && editCell?.col === 'qty'
                            ? <input className="cell-input" value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={saveEdit} onKeyDown={onKey} autoFocus type="number" />
                            : r.qty}
                        </td>
                        <td className="cell-editable cell-cost" onClick={() => startEdit(r.id, 'unitCost', r.unitCost)}>
                          {editCell?.id === r.id && editCell?.col === 'unitCost'
                            ? <input className="cell-input" value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={saveEdit} onKeyDown={onKey} autoFocus type="number" />
                            : fmt(r.unitCost)}
                        </td>
                        <td className="cell-cost">{fmt(r.totalCost)}</td>
                        <td>{r.leadTime}</td>
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
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
