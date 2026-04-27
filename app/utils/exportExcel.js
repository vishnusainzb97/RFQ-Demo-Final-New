import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/* ───────────────────────────────────────────────────────────
   Chemveda RFQ — Premium Multi-Sheet Excel Export
   Sheets:
     1. Executive Summary (quote overview + stoplight formatting)
     2. Vendor Comparison Matrix (side-by-side price grid)
     3. Detailed Procurement Schedule (full Chemveda template)
     4. Communications Audit Log (email thread history)
     5. Database Reference (mock internal catalog data)
   ─────────────────────────────────────────────────────────── */

// Brand Colors
const TEAL = 'FF0D9488';
const TEAL_LIGHT = 'FFF0FDFA';
const NAVY = 'FF0C1222';
const WHITE = 'FFFFFFFF';
const LIGHT_GRAY = 'FFF8FAFC';
const BORDER = 'FFE2E8F0';
const GREEN_BG = 'FFECFDF5';
const GREEN_TXT = 'FF059669';
const AMBER_BG = 'FFFFFBEB';
const AMBER_TXT = 'FFD97706';
const RED_BG = 'FFFEF2F2';
const RED_TXT = 'FFDC2626';
const BLUE_BG = 'FFDBEAFE';
const BLUE_TXT = 'FF3B82F6';
const PURPLE_BG = 'FFF3E8FF';
const PURPLE_TXT = 'FF7C3AED';
const ALT_ROW = 'FFF1F5F9';

function applyHeaderStyle(row, color = TEAL) {
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    cell.font = { bold: true, color: { argb: WHITE }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: BORDER } },
      bottom: { style: 'thin', color: { argb: BORDER } },
      left: { style: 'thin', color: { argb: BORDER } },
      right: { style: 'thin', color: { argb: BORDER } },
    };
  });
}

function applyBorders(row) {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: 'thin', color: { argb: BORDER } },
      bottom: { style: 'thin', color: { argb: BORDER } },
      left: { style: 'thin', color: { argb: BORDER } },
      right: { style: 'thin', color: { argb: BORDER } },
    };
  });
}

function altRowFill(row, idx) {
  if (idx % 2 === 1) {
    row.eachCell({ includeEmpty: true }, (cell) => {
      if (!cell.fill || cell.fill.pattern === 'none') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ALT_ROW } };
      }
    });
  }
}

function setColWidths(ws, widths) {
  ws.columns = widths.map(w => ({ width: w }));
}

function addTitleRow(ws, text, colSpan) {
  const r = ws.addRow([text]);
  ws.mergeCells(r.number, 1, r.number, colSpan);
  r.getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } };
  r.getCell(1).alignment = { vertical: 'middle' };
  r.height = 28;
  return r;
}

function addMetaRow(ws, label, value, colSpan) {
  const r = ws.addRow([label, value]);
  r.getCell(1).font = { bold: true, size: 10, color: { argb: 'FF64748B' } };
  r.getCell(2).font = { size: 10, color: { argb: NAVY } };
  return r;
}

// ──────────────── Stoplight badge helper ────────────────
function categoryBadge(cell, category) {
  const c = (category || '').toLowerCase();
  if (c.includes('ksm') || c.includes('int')) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_BG } };
    cell.font = { bold: true, color: { argb: BLUE_TXT }, size: 10 };
  } else if (c === 'reagent') {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_BG } };
    cell.font = { bold: true, color: { argb: PURPLE_TXT }, size: 10 };
  } else if (c === 'solvent') {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
    cell.font = { bold: true, color: { argb: AMBER_TXT }, size: 10 };
  } else {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ALT_ROW } };
    cell.font = { bold: true, color: { argb: 'FF64748B' }, size: 10 };
  }
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
}

function quoteCountBadge(cell, count) {
  if (count >= 4) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_BG } };
    cell.font = { bold: true, color: { argb: GREEN_TXT }, size: 11 };
  } else if (count >= 2) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
    cell.font = { bold: true, color: { argb: AMBER_TXT }, size: 11 };
  } else {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: RED_BG } };
    cell.font = { bold: true, color: { argb: RED_TXT }, size: 11 };
  }
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
}

function leadTimeBadge(cell, text) {
  const t = (text || '').toLowerCase();
  if (t.includes('1') && t.includes('week')) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_BG } };
    cell.font = { color: { argb: GREEN_TXT }, size: 10 };
  } else if (t.includes('6') || t.includes('7')) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: RED_BG } };
    cell.font = { color: { argb: RED_TXT }, size: 10 };
  } else {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
    cell.font = { color: { argb: AMBER_TXT }, size: 10 };
  }
}


// ═══════════════════════════════════════════════════════════
// MAIN EXPORT FUNCTION
// ═══════════════════════════════════════════════════════════
export async function exportToExcel(rfpInfo, chemicalsData, emailThread = []) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Chemveda RFQ Automation';
  wb.created = new Date();

  // ─────────────────────────────────────────────────────────
  // SHEET 1: EXECUTIVE SUMMARY
  // ─────────────────────────────────────────────────────────
  const ws1 = wb.addWorksheet('Executive Summary', {
    properties: { tabColor: { argb: TEAL } },
  });
  setColWidths(ws1, [22, 14, 18, 16, 40, 35, 22, 20]);

  addTitleRow(ws1, `📋 EXECUTIVE SUMMARY — ${rfpInfo.rfpCode}`, 8);
  ws1.addRow([]);
  addMetaRow(ws1, 'Customer', rfpInfo.customer, 8);
  addMetaRow(ws1, 'Product', rfpInfo.product, 8);
  addMetaRow(ws1, 'Date', rfpInfo.date, 8);
  addMetaRow(ws1, 'Status', 'Active — Quotes Received', 8);
  ws1.addRow([]);

  const h1 = ws1.addRow([
    'Chemical Name', 'CAS No', 'Category', 'Required Qty',
    'Best Price Quote', 'Best Lead Time', 'Quotes Available', 'Recommendation'
  ]);
  applyHeaderStyle(h1);

  chemicalsData.forEach((item, idx) => {
    const quotes = item.vendorQuotes || [];
    const numQ = quotes.length;
    const bestPrice = quotes.length > 0 ? quotes[0].price : 'No quotes';
    const bestLead = quotes.length > 0 ? quotes[0].leadTime : 'N/A';
    const recommendation = numQ >= 3 ? '✅ Multiple options' : numQ >= 1 ? '⚠️ Limited options' : '❌ No quotes';

    const r = ws1.addRow([
      item.chemicalName, item.casNo, item.category,
      `${item.qty} ${item.unit}`, bestPrice, bestLead, numQ, recommendation
    ]);
    applyBorders(r);
    altRowFill(r, idx);

    // Conditional formatting
    categoryBadge(r.getCell(3), item.category);
    quoteCountBadge(r.getCell(7), numQ);

    // Recommendation coloring
    const recCell = r.getCell(8);
    if (numQ >= 3) {
      recCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_BG } };
      recCell.font = { bold: true, color: { argb: GREEN_TXT }, size: 10 };
    } else if (numQ >= 1) {
      recCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
      recCell.font = { bold: true, color: { argb: AMBER_TXT }, size: 10 };
    } else {
      recCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: RED_BG } };
      recCell.font = { bold: true, color: { argb: RED_TXT }, size: 10 };
    }
  });

  // Summary bar
  ws1.addRow([]);
  const totalRow = ws1.addRow(['TOTAL COMPOUNDS', '', '', '', '', '', chemicalsData.length, '']);
  totalRow.getCell(1).font = { bold: true, size: 11, color: { argb: NAVY } };
  totalRow.getCell(7).font = { bold: true, size: 12, color: { argb: TEAL } };
  totalRow.getCell(7).alignment = { horizontal: 'center' };
  applyBorders(totalRow);

  // ─────────────────────────────────────────────────────────
  // SHEET 2: VENDOR COMPARISON MATRIX
  // ─────────────────────────────────────────────────────────
  const ws2 = wb.addWorksheet('Vendor Comparison', {
    properties: { tabColor: { argb: BLUE_TXT } },
  });

  // Collect all unique vendors
  const allVendors = [...new Set(chemicalsData.flatMap(c => (c.vendorQuotes || []).map(q => q.vendor)))];
  const matrixCols = ['Chemical Name', 'CAS No', 'Category', 'Qty Required', ...allVendors.flatMap(v => [`${v} — Price`, `${v} — Lead Time`])];

  setColWidths(ws2, [25, 14, 12, 14, ...allVendors.flatMap(() => [28, 22])]);

  addTitleRow(ws2, `📊 VENDOR COMPARISON MATRIX — ${rfpInfo.rfpCode}`, matrixCols.length);
  ws2.addRow([]);

  const h2 = ws2.addRow(matrixCols);
  applyHeaderStyle(h2, NAVY);

  // Color vendor sub-headers with alternating tints
  const vendorColors = [TEAL, BLUE_TXT, PURPLE_TXT, AMBER_TXT, GREEN_TXT];
  allVendors.forEach((v, vi) => {
    const priceCol = 5 + vi * 2;
    const leadCol = 6 + vi * 2;
    const col = vendorColors[vi % vendorColors.length];
    h2.getCell(priceCol).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col } };
    h2.getCell(leadCol).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col } };
  });

  chemicalsData.forEach((item, idx) => {
    const rowData = [item.chemicalName, item.casNo, item.category, `${item.qty} ${item.unit}`];
    allVendors.forEach(v => {
      const quote = (item.vendorQuotes || []).find(q => q.vendor === v);
      rowData.push(quote ? quote.price : '—');
      rowData.push(quote ? quote.leadTime : '—');
    });
    const r = ws2.addRow(rowData);
    applyBorders(r);
    altRowFill(r, idx);
    categoryBadge(r.getCell(3), item.category);

    // Color lead times
    allVendors.forEach((v, vi) => {
      const leadCol = 6 + vi * 2;
      const leadCell = r.getCell(leadCol);
      if (leadCell.value && leadCell.value !== '—') {
        leadTimeBadge(leadCell, String(leadCell.value));
      }
    });
  });

  // ─────────────────────────────────────────────────────────
  // SHEET 3: DETAILED PROCUREMENT SCHEDULE
  // ─────────────────────────────────────────────────────────
  const ws3 = wb.addWorksheet(rfpInfo.rfpCode || 'Detailed_Data', {
    properties: { tabColor: { argb: GREEN_TXT } },
  });

  addTitleRow(ws3, `📋 DETAILED PROCUREMENT SCHEDULE — ${rfpInfo.rfpCode}`, 13);
  ws3.addRow([]);

  // RFP metadata
  [
    ['Date', rfpInfo.date],
    ['Customer', rfpInfo.customer],
    ['RFP Code', rfpInfo.rfpCode],
    ['Product', rfpInfo.product],
    ['Scale 1', rfpInfo.scale1],
    ['Scale 2', rfpInfo.scale2],
  ].forEach(([l, v]) => addMetaRow(ws3, l, v, 13));
  ws3.addRow([]);

  const baseHeaders = [
    'Stage', 'Category', 'Chemical Name', 'CAS NO', 'Qty', 'Unit', 'Density',
    'Mol.Wt', 'Moles', 'Mole. eq', 'Ratio', 'Purity', 'Storage'
  ];
  const scaleHeaders = [
    'Qty.', 'Units', 'Unit Cost (INR)', 'Total Cost (INR)',
    '% of total cost', 'Source', 'Country', 'Lead Time', 'Remarks'
  ];

  const row6 = [...baseHeaders, ...scaleHeaders, '', ...scaleHeaders, '', ...scaleHeaders];
  const headerRow = ws3.addRow(row6);
  applyHeaderStyle(headerRow);

  // Scale labels
  const scaleStartCols = [14, 24, 34];
  const scaleLabels = [rfpInfo.scale1, rfpInfo.scale2, rfpInfo.scale3 || 'Scale 3'];
  // Add a row above for scale labels
  scaleStartCols.forEach((col, i) => {
    const cell = headerRow.getCell(col);
    cell.note = scaleLabels[i];
  });

  let scaleTotals = [0, 0, 0];
  chemicalsData.forEach(item => {
    if (item.scales) {
      item.scales.forEach((s, idx) => {
        scaleTotals[idx] += (s.totalCost || 0);
      });
    }
  });

  chemicalsData.forEach((item, rIdx) => {
    const rowData = [
      item.stage || '', item.category || '', item.chemicalName || '', item.casNo || '',
      item.qty || '', item.unit || '', item.density || '', item.molWt || '',
      item.moles || '', item.moleEq || '', item.ratio || '',
      item.purity || '', item.storageCondition || ''
    ];

    if (item.scales) {
      item.scales.forEach((scale, idx) => {
        const pctCost = (scaleTotals[idx] > 0) ? (scale.totalCost / scaleTotals[idx]) : 0;
        rowData.push(
          scale.qty, scale.units, scale.unitCost, scale.totalCost, pctCost,
          scale.source, scale.country, scale.leadTime, scale.remarks, ''
        );
      });
    }

    const dataRow = ws3.addRow(rowData);
    applyBorders(dataRow);
    altRowFill(dataRow, rIdx);
    categoryBadge(dataRow.getCell(2), item.category);

    // Currency formatting
    [16, 17, 26, 27, 36, 37].forEach(c => {
      if (dataRow.getCell(c).value) dataRow.getCell(c).numFmt = '₹#,##0.00';
    });
    [18, 28, 38].forEach(c => {
      if (dataRow.getCell(c).value) dataRow.getCell(c).numFmt = '0.00%';
    });

    // Lead time coloring
    [21, 31, 41].forEach(c => {
      const cell = dataRow.getCell(c);
      if (cell.value) leadTimeBadge(cell, String(cell.value));
    });
  });

  // Totals row
  ws3.addRow([]);
  const totalsData = Array(13).fill('');
  totalsData[0] = 'TOTAL';
  ['', '', '', scaleTotals[0], 1, '', '', '', '', ''].forEach(val => totalsData.push(val));
  ['', '', '', scaleTotals[1], 1, '', '', '', '', ''].forEach(val => totalsData.push(val));
  ['', '', '', scaleTotals[2], 1, '', '', '', '', ''].forEach(val => totalsData.push(val));

  const tr = ws3.addRow(totalsData);
  tr.eachCell(cell => {
    cell.font = { bold: true, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL_LIGHT } };
    cell.border = { top: { style: 'double', color: { argb: TEAL } } };
  });
  [17, 27, 37].forEach(c => { tr.getCell(c).numFmt = '₹#,##0.00'; });

  setColWidths(ws3, [
    12, 10, 25, 14, 8, 6, 8, 8, 8, 8, 8, 12, 18,
    8, 6, 14, 16, 10, 10, 10, 14, 15, 2,
    8, 6, 14, 16, 10, 10, 10, 14, 15, 2,
    8, 6, 14, 16, 10, 10, 10, 14, 15
  ]);

  // ─────────────────────────────────────────────────────────
  // SHEET 4: COMMUNICATIONS AUDIT LOG
  // ─────────────────────────────────────────────────────────
  const ws4 = wb.addWorksheet('Communications Log', {
    properties: { tabColor: { argb: PURPLE_TXT } },
  });
  setColWidths(ws4, [6, 14, 18, 16, 14, 60, 30]);

  addTitleRow(ws4, `📧 COMMUNICATIONS AUDIT LOG — ${rfpInfo.rfpCode}`, 7);
  ws4.addRow([]);
  addMetaRow(ws4, 'Thread Subject', `RFQ Quote Request — ${rfpInfo.product}`, 7);
  addMetaRow(ws4, 'Total Messages', `${emailThread.length} emails`, 7);
  addMetaRow(ws4, 'Participants', [...new Set(emailThread.map(e => e.sender))].join(', '), 7);
  ws4.addRow([]);

  const h4 = ws4.addRow(['#', 'Timestamp', 'Sender', 'Company', 'Role', 'Message Body', 'Key Data Extracted']);
  applyHeaderStyle(h4, NAVY);

  emailThread.forEach((msg, idx) => {
    const highlights = (msg.highlights || []).join(', ');
    const bodyClean = msg.body.replace(/\\n/g, '\n');
    const r = ws4.addRow([idx + 1, msg.time, msg.sender, msg.company, msg.role === 'buyer' ? 'Client' : 'Vendor', bodyClean, highlights]);
    applyBorders(r);
    altRowFill(r, idx);

    // Role badge
    const roleCell = r.getCell(5);
    if (msg.role === 'buyer') {
      roleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_BG } };
      roleCell.font = { bold: true, color: { argb: BLUE_TXT }, size: 10 };
    } else {
      roleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
      roleCell.font = { bold: true, color: { argb: AMBER_TXT }, size: 10 };
    }

    // Highlights badge
    if (highlights) {
      r.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_BG } };
      r.getCell(7).font = { bold: true, color: { argb: GREEN_TXT }, size: 10 };
    }

    // Wrap text for body
    r.getCell(6).alignment = { wrapText: true, vertical: 'top' };
    r.getCell(7).alignment = { wrapText: true, vertical: 'top' };
    r.height = 80;
  });

  // ─────────────────────────────────────────────────────────
  // SHEET 5: DATABASE REFERENCE (Mock Internal Catalog)
  // ─────────────────────────────────────────────────────────
  const ws5 = wb.addWorksheet('Database Reference', {
    properties: { tabColor: { argb: AMBER_TXT } },
  });
  setColWidths(ws5, [25, 14, 16, 12, 14, 14, 22, 10, 10, 14]);

  addTitleRow(ws5, `🗄️ INTERNAL DATABASE REFERENCE — ${rfpInfo.rfpCode}`, 10);
  ws5.addRow([]);
  addMetaRow(ws5, 'Source', 'Chemveda Internal Catalog (Mock Data)', 10);
  addMetaRow(ws5, 'Note', 'This sheet will be auto-populated from your legacy database once connected.', 10);
  ws5.addRow([]);

  const h5 = ws5.addRow([
    'Chemical Name', 'CAS No', 'Catalog No', 'Category',
    'Warehouse Stock', 'Purity', 'Storage Condition',
    'Mol. Weight', 'Density', 'Last Procured'
  ]);
  applyHeaderStyle(h5, TEAL);

  chemicalsData.forEach((item, idx) => {
    const r = ws5.addRow([
      item.chemicalName, item.casNo, item.catalogNo || 'N/A', item.category,
      item.warehouseStock || 'N/A', item.purity || 'N/A', item.storageCondition || 'N/A',
      item.molWt || '', item.density || '', 'Q1 2026'
    ]);
    applyBorders(r);
    altRowFill(r, idx);
    categoryBadge(r.getCell(4), item.category);

    // Stock level coloring
    const stockCell = r.getCell(5);
    const stockStr = (item.warehouseStock || '').toLowerCase();
    if (stockStr.includes('kg') || stockStr.includes('drum')) {
      stockCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_BG } };
      stockCell.font = { bold: true, color: { argb: GREEN_TXT }, size: 10 };
    } else if (stockStr.includes('g')) {
      stockCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
      stockCell.font = { bold: true, color: { argb: AMBER_TXT }, size: 10 };
    }
  });

  // ─────────────────────────────────────────────────────────
  // SHEET 6: FULL VENDOR QUOTES (All quotes per chemical)
  // ─────────────────────────────────────────────────────────
  const ws6 = wb.addWorksheet('All Vendor Quotes', {
    properties: { tabColor: { argb: GREEN_TXT } },
  });
  setColWidths(ws6, [25, 14, 12, 18, 40, 30, 25]);

  addTitleRow(ws6, `💰 FULL VENDOR QUOTE LOG — ${rfpInfo.rfpCode}`, 7);
  ws6.addRow([]);

  const h6 = ws6.addRow([
    'Chemical Name', 'CAS No', 'Category', 'Vendor',
    'Price Quote', 'Lead Time', 'Remarks'
  ]);
  applyHeaderStyle(h6);

  let rowIdx = 0;
  chemicalsData.forEach((item) => {
    const quotes = item.vendorQuotes || [];
    if (quotes.length === 0) return;

    quotes.forEach((q, qi) => {
      const r = ws6.addRow([
        qi === 0 ? item.chemicalName : '',
        qi === 0 ? item.casNo : '',
        qi === 0 ? item.category : '',
        q.vendor, q.price, q.leadTime, q.remarks || ''
      ]);
      applyBorders(r);
      altRowFill(r, rowIdx);

      if (qi === 0) {
        categoryBadge(r.getCell(3), item.category);
        r.getCell(1).font = { bold: true, size: 11, color: { argb: NAVY } };
      }

      // Lead time coloring
      leadTimeBadge(r.getCell(6), q.leadTime);
      rowIdx++;
    });

    // Separator
    const sep = ws6.addRow([]);
    sep.height = 6;
    rowIdx++;
  });


  // ─────────────────────────────────────────────────────────
  // OUTPUT
  // ─────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  // Ensure the buffer is correctly treated as binary data across all environments
  const uint8Array = new Uint8Array(buffer);
  const blob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${rfpInfo.rfpCode || 'RFQ'}_Chemveda_Export.xlsx`);
}
