import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportToExcel(rfpInfo, chemicalsData) {
  const wb = new ExcelJS.Workbook();
  
  // ---------------------------------------------------------
  // SHEET 1: SUMMARY SHEET (Custom Client Request)
  // ---------------------------------------------------------
  const wsSummary = wb.addWorksheet('Summary');
  
  // Summary Headers
  const summaryHeaders = wsSummary.addRow([
    'CAS No', 'Qty', 'No of quotes avlb', 'Vendor', 'Price$', 'Lead Time', 'Remark'
  ]);
  
  // Dark header color
  summaryHeaders.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF107C41' } }; // Excel green
    cell.font = { bold: true, color: { argb: 'FFFFFFFF'} }; // White text
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });

  wsSummary.columns = [
    { width: 18 }, // CAS
    { width: 15 }, // Qty
    { width: 18 }, // No of Quotes
    { width: 15 }, // Vendor
    { width: 40 }, // Price
    { width: 35 }, // Lead Time
    { width: 20 }  // Remark
  ];

  chemicalsData.forEach((item, index) => {
    const quotes = item.vendorQuotes || [];
    const numQuotes = quotes.length;
    const qtyText = item.summaryQty || '';
    
    // Alternating group color (Light Grey vs Very Light Blue/Green)
    const isEvenGrp = index % 2 === 0;
    const groupColor = isEvenGrp ? 'FFF0F8FF' : 'FFFFFFFF'; // Alice blue vs White
    const topRowColor = 'FFE2EFDA'; // Light Greenish for the top main row
    
    if (numQuotes === 0) {
      const r = wsSummary.addRow([item.casNo, qtyText, 0, '', '', '', '']);
      r.eachCell({ includeEmpty: true }, cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: topRowColor }}; cell.font={bold:true}; });
    } else {
      // First row of the group gets the CAS, Qty, and Quote Count
      const r1 = wsSummary.addRow([
        item.casNo || '', 
        qtyText, 
        numQuotes, 
        quotes[0].vendor, 
        quotes[0].price, 
        quotes[0].leadTime, 
        quotes[0].remarks
      ]);
      
      // Color entire top row
      r1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // give the first 3 columns a highlighted bold effect
        if (colNumber <= 3) {
           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: topRowColor } };
           cell.font = { bold: true };
           cell.alignment = { vertical: 'top' };
        } else {
           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: groupColor } };
        }
      });
      
      // Subsequent rows
      for (let i = 1; i < numQuotes; i++) {
        const sr = wsSummary.addRow([
          '', '', '', 
          quotes[i].vendor, 
          quotes[i].price, 
          quotes[i].leadTime, 
          quotes[i].remarks
        ]);
        sr.eachCell({ includeEmpty: true }, (cell, colNum) => {
          if (colNum > 3) {
             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: groupColor } };
          }
        });
      }
    }
    // Add a tiny blank separator row between blocks for spacing
    wsSummary.addRow([]);
  });

  // Apply basic borders to all cells
  wsSummary.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value || cell.fill) {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
            bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
            left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
            right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
          };
        }
      });
    }
  });


  // ---------------------------------------------------------
  // SHEET 2: DETAILED TEMPLATE (Chemveda Master)
  // ---------------------------------------------------------
  const wsDetailed = wb.addWorksheet(rfpInfo.rfpCode || 'Detailed_Data');

  wsDetailed.addRow([null, null, 'Date', rfpInfo.date]);
  wsDetailed.addRow([null, null, 'Customer', rfpInfo.customer]);
  wsDetailed.addRow([null, null, 'RFP code', rfpInfo.rfpCode]);
  wsDetailed.addRow([null, null, 'Product', rfpInfo.product]);
  
  const row5 = [null, null, 'Quantity', rfpInfo.scale1, null, null, null, null, null, null, null, null, null];
  row5.push(rfpInfo.scale2, null, null, null, null, null, null, null, null, null);
  row5.push(rfpInfo.scale3, null, null, null, null, null, null, null, null, null);
  wsDetailed.addRow(row5);

  const baseHeaders = [
    'Stage', 'Category', 'Chemical Name', 'CAS NO', 'Qty', 'Unit', 'Density',
    'Mol.Wt', 'Moles', 'Mole. eq', 'Yield reported-%', 'Yields considered-%', 'Ratio'
  ];
  const scaleHeaders = [
    'Qty.', 'Units', 'Unit Cost (INR)', 'Total Cost (INR)',
    '% of total cost', 'Source', 'Country', 'Lead Time', 'Remarks'
  ];

  const row6 = [...baseHeaders, ...scaleHeaders, null, ...scaleHeaders, null, ...scaleHeaders];
  const headerRow = wsDetailed.addRow(row6);

  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF107C41' } }; // Excel green header
    cell.font = { bold: true, color: {argb: 'FFFFFFFF'} }; // White text
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });

  let scaleTotals = [0, 0, 0];
  chemicalsData.forEach(item => {
    if(item.scales) {
      item.scales.forEach((s, idx) => {
        scaleTotals[idx] += (s.totalCost || 0);
      });
    }
  });

  chemicalsData.forEach((item, rIdx) => {
    const rowData = [
      item.stage || '', item.category || '', item.chemicalName || '', item.casNo || '',
      item.qty || '', item.unit || '', item.density || '', item.molWt || '',
      item.moles || '', item.moleEq || '', item.yieldReported || '', item.yieldConsidered || '', item.ratio || ''
    ];

    if(item.scales) {
      item.scales.forEach((scale, idx) => {
        const pctCost = (scaleTotals[idx] > 0) ? (scale.totalCost / scaleTotals[idx]) : 0;
        rowData.push(
          scale.qty, scale.units, scale.unitCost, scale.totalCost, pctCost,
          scale.source, scale.country, scale.leadTime, scale.remarks, null
        );
      });
    }

    const dataRow = wsDetailed.addRow(rowData);
    // Alternate row styling for the main text grid
    const rowColor = rIdx % 2 === 0 ? 'FFFFFFFF' : 'FFF9F9F9';
    
    dataRow.eachCell((cell, colNum) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
      };
      const isCurrency = [16, 17, 26, 27, 36, 37].includes(colNum);
      const isPercent = [18, 28, 38].includes(colNum);
      if (isCurrency) cell.numFmt = '₹#,##0.00';
      else if (isPercent) cell.numFmt = '0.00%';
    });
  });

  wsDetailed.columns = [
    { width: 12 }, { width: 10 }, { width: 25 }, { width: 12 }, 
    { width: 8 }, { width: 6 }, { width: 8 }, { width: 8 },
    { width: 8 }, { width: 8 }, { width: 12 }, { width: 12 }, { width: 8 },
    { width: 8 }, { width: 6 }, { width: 12 }, { width: 14 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 15 }, { width: 2 },
    { width: 8 }, { width: 6 }, { width: 12 }, { width: 14 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 15 }, { width: 2 },
    { width: 8 }, { width: 6 }, { width: 12 }, { width: 14 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 15 }
  ];

  const totalsRowData = Array(13).fill('');
  totalsRowData[12] = 'TOTAL';
  ['', '', '', scaleTotals[0], 1, '', '', '', '', ''].forEach(val => totalsRowData.push(val));
  ['', '', '', scaleTotals[1], 1, '', '', '', '', ''].forEach(val => totalsRowData.push(val));
  ['', '', '', scaleTotals[2], 1, '', '', '', '', ''].forEach(val => totalsRowData.push(val));
  
  const tr = wsDetailed.addRow(totalsRowData);
  tr.eachCell(cell => {
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
    cell.border = { top: { style: 'double' } };
  });
  
  tr.getCell(17).numFmt = '₹#,##0.00';
  tr.getCell(27).numFmt = '₹#,##0.00';
  tr.getCell(37).numFmt = '₹#,##0.00';

  // Output
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${rfpInfo.rfpCode || 'RFQ'}_Detailed_Export.xlsx`);
}
