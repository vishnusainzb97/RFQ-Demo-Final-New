import * as XLSX from 'xlsx';

export function generateChemvedaExcelBuffer(data, rfpInfo) {
  const totalCost = data.reduce((s, r) => s + (r.totalCost || 0), 0);

  const rows = [
    ['RFQ Automation — Extracted Data'], [],
    ['Date', rfpInfo?.date || '', '', 'Customer', rfpInfo?.customer || ''],
    ['RFP Code', rfpInfo?.rfpCode || '', '', 'Product', rfpInfo?.product || ''],
    ['Quantity', rfpInfo?.quantity || ''], [],
    ['Stage', 'Category', 'Chemical', 'CAS No.', 'Qty', 'Units', 'Rate (₹)', 'Total (₹)', 'Source', 'Country', 'Lead Time'],
    ...data.map(r => [
      r.stage || '', 
      r.categoryLabel || '', 
      r.chemicalName || '', 
      r.casNumber || '', 
      r.qty || 0, 
      r.units || '', 
      r.unitCost || 0, 
      r.totalCost || 0, 
      r.source || 'Local', 
      r.country || 'India', 
      r.leadTime || '1 Week'
    ]),
    [], ['', '', '', '', '', '', 'TOTAL', totalCost.toFixed(2)],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  
  ws['!cols'] = [
    { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, 
    { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 14 }, 
    { wch: 12 }, { wch: 10 }, { wch: 10 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, rfpInfo?.rfpCode || 'RFQ_Data');
  
  // Write to buffer
  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
}
