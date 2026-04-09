// RFQ Workflow Automation — Multiple Scenarios
// Each trigger loads a different email thread + table data randomly

const scenario1 = {
  rfpInfo: { date: '18-02-2026', customer: 'Nurik Therapeutics', rfpCode: 'NUR-CS-01-26', product: '5-Fluoropicolinic acid', quantity: '0.5 Kg & 100 Kg' },
  emailThread: [
    { id: 1, sender: 'Ravi Mehta', role: 'buyer', company: 'Nurik Therapeutics', time: 'Feb 15, 2026 · 10:23 AM',
      body: `Dear Team,\n\nWe are looking for quotations for the following chemicals required for our 5-Fluoropicolinic acid synthesis project (RFP Code: NUR-CS-01-26).\n\nPlease share your best prices for:\n• 2,2,3,3-Tetrafluoro-1-propanol (CAS: 76-37-9) — 5.31 Kg\n• Triethylamine (CAS: 121-44-8) — 4.88 Kg\n• p-Toluenesulfonyl chloride (CAS: 98-59-9)\n\nDelivery to Hyderabad facility.`,
      highlights: ['5-Fluoropicolinic acid', 'NUR-CS-01-26', '76-37-9', '5.31 Kg', '121-44-8', '4.88 Kg', '98-59-9'] },
    { id: 2, sender: 'Anupam Goel', role: 'vendor', company: 'Survival Technologies', time: 'Feb 17, 2026 · 3:45 PM',
      body: `Dear Sir,\n\nWe can offer 60 kgs @ 27000 per kg\n125 kgs @ 24300 per kg\n\n++ ex works...\nDel 2-3 weeks\n\nBest Regards,\nAnupam Goel\nAVP - SALES AND MARKETING\nSURVIVAL TECHNOLOGIES PVT LIMITED`,
      highlights: ['60 kgs', '27000 per kg', '125 kgs', '24300 per kg', 'ex works', '2-3 weeks'] },
    { id: 3, sender: 'Deepak Sharma', role: 'vendor', company: 'Angene Chemical', time: 'Feb 18, 2026 · 9:12 AM',
      body: `Hi,\n\nPlease find below our offer:\n- Tetrafluoropropanol: ₹4,400/kg (MOQ 5kg), Angene China, lead 2-3 weeks\n- Triethylamine: ₹627/kg, ex-stock India\n- TsCl: ₹100/kg, ex-stock\n- Silica gel 60-120 mesh @ ₹220/kg\n\nBest,\nDeepak Sharma | Angene Chemical`,
      highlights: ['₹4,400/kg', '₹627/kg', '₹100/kg', '₹220/kg', 'Angene China', '2-3 weeks', 'ex-stock'] },
  ],
  tableData: [
    { id: 1, stage: 'Stage-1', category: 'KSM', categoryLabel: 'KSM-1', chemicalName: '2,2,3,3-Tetrafluoro-1-propanol', casNumber: '76-37-9', qty: 5.31, units: 'Kg', unitCost: 4400, totalCost: 23364, pctTotal: 5.59, source: 'Angene', country: 'China', flag: '🇨🇳', leadTime: '2-3 wks', remarks: '' },
    { id: 2, stage: 'Stage-1', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'Triethylamine', casNumber: '121-44-8', qty: 4.88, units: 'Kg', unitCost: 627, totalCost: 3059.76, pctTotal: 0.47, source: 'Apple', country: 'India', flag: '🇮🇳', leadTime: '1-2 wks', remarks: '' },
    { id: 3, stage: 'Stage-1', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'p-Toluenesulfonyl chloride', casNumber: '98-59-9', qty: 9.19, units: 'Kg', unitCost: 100, totalCost: 919, pctTotal: 0.14, source: '', country: 'India', flag: '🇮🇳', leadTime: '1-2 wks', remarks: '' },
    { id: 4, stage: 'Stage-1', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'DMA (Dimethylacetamide)', casNumber: '127-19-5', qty: 101.49, units: 'Kg', unitCost: 150, totalCost: 15223.50, pctTotal: 2.34, source: '', country: 'India', flag: '🇮🇳', leadTime: '1-2 wks', remarks: '' },
    { id: 5, stage: 'Stage-1', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'Ethyl acetate', casNumber: '141-78-6', qty: 67.87, units: 'Kg', unitCost: 90, totalCost: 6108.30, pctTotal: 0.94, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 6, stage: 'Stage-1', category: 'General', categoryLabel: 'General', chemicalName: 'Silica gel (60-120 mesh)', casNumber: '112926-00-8', qty: 106.13, units: 'Kg', unitCost: 220, totalCost: 23348.60, pctTotal: 3.59, source: '', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 7, stage: 'Stage-2', category: 'KSM', categoryLabel: 'Int-1', chemicalName: 'Stage-1 Intermediate', casNumber: '—', qty: 10.01, units: 'Kg', unitCost: 10390, totalCost: 103973.90, pctTotal: 15.70, source: 'In-house', country: 'India', flag: '🇮🇳', leadTime: '—', remarks: 'From Stage-1' },
    { id: 8, stage: 'Stage-2', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'n-BuLi in THF (2.5M)', casNumber: '109-72-8', qty: 33.62, units: 'Kg', unitCost: 2800, totalCost: 94136, pctTotal: 14.49, source: 'Sainor', country: 'India', flag: '🇮🇳', leadTime: '2-3 wks', remarks: '' },
    { id: 9, stage: 'Stage-2', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'Tetrahydrofuran (THF)', casNumber: '109-99-9', qty: 85.30, units: 'Kg', unitCost: 380, totalCost: 32414, pctTotal: 4.98, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1-2 wks', remarks: '' },
    { id: 10, stage: 'Stage-3', category: 'KSM', categoryLabel: 'Int-2', chemicalName: 'Stage-2 Intermediate', casNumber: '—', qty: 7.85, units: 'Kg', unitCost: 31250, totalCost: 245312.50, pctTotal: 37.72, source: 'In-house', country: 'India', flag: '🇮🇳', leadTime: '—', remarks: 'From Stage-2' },
    { id: 11, stage: 'Stage-3', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'Potassium permanganate', casNumber: '7722-64-7', qty: 12.40, units: 'Kg', unitCost: 520, totalCost: 6448, pctTotal: 0.99, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 12, stage: 'Stage-3', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'Acetone', casNumber: '67-64-1', qty: 95.00, units: 'Kg', unitCost: 75, totalCost: 7125, pctTotal: 1.10, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
  ],
};

const scenario2 = {
  rfpInfo: { date: '05-03-2026', customer: 'Aragen Life Sciences', rfpCode: 'ARA-PH-09-26', product: 'Sorafenib Tosylate', quantity: '2.0 Kg' },
  emailThread: [
    { id: 1, sender: 'Priya Nair', role: 'buyer', company: 'Aragen Life Sciences', time: 'Mar 2, 2026 · 11:40 AM',
      body: `Hello,\n\nWe need urgent quotations for our Sorafenib Tosylate synthesis campaign (Ref: ARA-PH-09-26).\n\nRequired chemicals:\n• 4-Chloropyridine-2-carboxylic acid (CAS: 5326-23-8) — 3.2 Kg\n• 4-(4-Aminophenoxy)-N-methylpicolinamide (CAS: 65-85-0) — 1.5 Kg\n• N-Methylmorpholine (CAS: 109-02-4) — 8 Kg\n\nPlease quote CIF Hyderabad.\n\nRegards,\nPriya Nair\nAragen Life Sciences`,
      highlights: ['Sorafenib Tosylate', 'ARA-PH-09-26', '5326-23-8', '3.2 Kg', '65-85-0', '1.5 Kg', '109-02-4', '8 Kg'] },
    { id: 2, sender: 'Kenji Yamamoto', role: 'vendor', company: 'TCI Chemicals Japan', time: 'Mar 3, 2026 · 6:15 PM',
      body: `Dear Priya-san,\n\nThank you for the inquiry.\n\nOur quotation:\n• 4-Chloropyridine-2-carboxylic acid: JPY 8,500/kg (≈₹4,760/kg), MOQ 1kg\n• N-Methylmorpholine: JPY 3,200/kg (≈₹1,790/kg)\n\nDelivery: 3-4 weeks CIF India\nPayment: NET 30\n\nBest regards,\nKenji Yamamoto\nTCI Chemicals Co., Ltd.`,
      highlights: ['₹4,760/kg', '₹1,790/kg', '3-4 weeks', 'CIF India', 'NET 30'] },
    { id: 3, sender: 'Sanjay Patel', role: 'vendor', company: 'Loba Chemie', time: 'Mar 4, 2026 · 10:02 AM',
      body: `Hi Priya,\n\nHere's our best offer for your campaign:\n- 4-Chloropyridine-2-carb. acid: ₹5,200/kg, ex-stock Mumbai\n- Aminophenoxy picolinamide: ₹18,500/kg, 4-5 weeks (import)\n- NMM: ₹1,450/kg, ready stock\n- Bonus: DMSO (pharma grade) ₹340/kg if needed\n\nThanks,\nSanjay Patel | Loba Chemie Pvt Ltd`,
      highlights: ['₹5,200/kg', '₹18,500/kg', '₹1,450/kg', '₹340/kg', '4-5 weeks', 'ex-stock Mumbai', 'ready stock'] },
  ],
  tableData: [
    { id: 1, stage: 'Stage-1', category: 'KSM', categoryLabel: 'KSM-1', chemicalName: '4-Chloropyridine-2-carboxylic acid', casNumber: '5326-23-8', qty: 3.20, units: 'Kg', unitCost: 4760, totalCost: 15232, pctTotal: 8.12, source: 'TCI', country: 'Japan', flag: '🇯🇵', leadTime: '3-4 wks', remarks: '' },
    { id: 2, stage: 'Stage-1', category: 'KSM', categoryLabel: 'KSM-2', chemicalName: '4-(4-Aminophenoxy)-N-methylpicolinamide', casNumber: '65-85-0', qty: 1.50, units: 'Kg', unitCost: 18500, totalCost: 27750, pctTotal: 14.81, source: 'Loba', country: 'India', flag: '🇮🇳', leadTime: '4-5 wks', remarks: 'Import via Loba' },
    { id: 3, stage: 'Stage-1', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'N-Methylmorpholine', casNumber: '109-02-4', qty: 8.00, units: 'Kg', unitCost: 1450, totalCost: 11600, pctTotal: 6.19, source: 'Loba', country: 'India', flag: '🇮🇳', leadTime: 'Ready', remarks: '' },
    { id: 4, stage: 'Stage-1', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'HATU Coupling Reagent', casNumber: '148893-10-1', qty: 2.40, units: 'Kg', unitCost: 12800, totalCost: 30720, pctTotal: 16.39, source: 'GL Biochem', country: 'China', flag: '🇨🇳', leadTime: '2-3 wks', remarks: '' },
    { id: 5, stage: 'Stage-1', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'DMSO (pharma grade)', casNumber: '67-68-5', qty: 45.00, units: 'Kg', unitCost: 340, totalCost: 15300, pctTotal: 8.16, source: 'Loba', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 6, stage: 'Stage-1', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'Dichloromethane (DCM)', casNumber: '75-09-2', qty: 120.00, units: 'Kg', unitCost: 85, totalCost: 10200, pctTotal: 5.44, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 7, stage: 'Stage-2', category: 'KSM', categoryLabel: 'Int-1', chemicalName: 'Stage-1 Intermediate', casNumber: '—', qty: 4.20, units: 'Kg', unitCost: 26430, totalCost: 111006, pctTotal: 59.24, source: 'In-house', country: 'India', flag: '🇮🇳', leadTime: '—', remarks: 'From Stage-1' },
    { id: 8, stage: 'Stage-2', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'p-Toluenesulfonic acid', casNumber: '104-15-4', qty: 1.80, units: 'Kg', unitCost: 420, totalCost: 756, pctTotal: 0.40, source: '', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 9, stage: 'Stage-2', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'Methanol (AR grade)', casNumber: '67-56-1', qty: 60.00, units: 'Kg', unitCost: 120, totalCost: 7200, pctTotal: 3.84, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 10, stage: 'Stage-2', category: 'General', categoryLabel: 'General', chemicalName: 'Celite 545 (filter aid)', casNumber: '68855-54-9', qty: 5.00, units: 'Kg', unitCost: 650, totalCost: 3250, pctTotal: 1.73, source: '', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
  ],
};

const scenario3 = {
  rfpInfo: { date: '22-03-2026', customer: 'Biocon Ltd', rfpCode: 'BCN-API-15-26', product: 'Atorvastatin Calcium', quantity: '10 Kg' },
  emailThread: [
    { id: 1, sender: 'Meena Iyer', role: 'buyer', company: 'Biocon Ltd', time: 'Mar 20, 2026 · 9:00 AM',
      body: `Dear Vendors,\n\nPlease provide best quotations for our Atorvastatin Calcium API batch (BCN-API-15-26, 10 Kg scale).\n\nKey materials needed:\n• tert-Butyl (4R,6R)-2-formyl-4,6-dimethyl-1,3-dioxane-4-carboxylate — 6.8 Kg\n• 4-Fluorobenzaldehyde (CAS: 459-57-4) — 12 Kg\n• Diethyl (3R)-3-(4-fluorophenyl)glutarate — 8.2 Kg\n\nTarget pricing under budget. Send quotes by EOD tomorrow.\n\nMeena Iyer | Sr. Procurement\nBiocon Ltd, Bangalore`,
      highlights: ['Atorvastatin Calcium', 'BCN-API-15-26', '10 Kg', '6.8 Kg', '459-57-4', '12 Kg', '8.2 Kg'] },
    { id: 2, sender: 'Wei Chen', role: 'vendor', company: 'Hubei Vanz Pharm', time: 'Mar 21, 2026 · 2:30 PM',
      body: `Dear Meena,\n\nGreetings from Hubei Vanz!\n\nPlease see our competitive offer:\n- Fluorobenzaldehyde (459-57-4): USD 28/kg (≈₹2,350/kg), FOB Shanghai\n- Diethyl glutarate: USD 145/kg (≈₹12,180/kg), 2 weeks production\n- Lithium diisopropylamide: USD 85/kg (≈₹7,140/kg)\n\nMOQ: 5kg per item. Payment: T/T 50% advance.\n\nWei Chen\nHubei Vanz Pharm Co., Ltd.`,
      highlights: ['₹2,350/kg', 'FOB Shanghai', '₹12,180/kg', '2 weeks', '₹7,140/kg', '50% advance'] },
    { id: 3, sender: 'Nikhil Rao', role: 'vendor', company: 'Sai Life Sciences', time: 'Mar 21, 2026 · 5:55 PM',
      body: `Hi Meena,\n\nOur pricing for your Atorvastatin campaign:\n\n1. 4-Fluorobenzaldehyde: ₹2,100/kg — ex-stock Hyd warehouse\n2. Diethyl glutarate intermediate: ₹14,500/kg — need 3 weeks lead\n3. Calcium chloride (anhydrous): ₹180/kg — immediate\n4. Activated carbon: ₹280/kg — immediate\n\nHappy to discuss further.\n\nNikhil Rao\nSai Life Sciences`,
      highlights: ['₹2,100/kg', 'ex-stock', '₹14,500/kg', '3 weeks', '₹180/kg', '₹280/kg', 'immediate'] },
  ],
  tableData: [
    { id: 1, stage: 'Stage-1', category: 'KSM', categoryLabel: 'KSM-1', chemicalName: '4-Fluorobenzaldehyde', casNumber: '459-57-4', qty: 12.00, units: 'Kg', unitCost: 2100, totalCost: 25200, pctTotal: 5.82, source: 'Sai Life', country: 'India', flag: '🇮🇳', leadTime: 'Ready', remarks: 'Best price' },
    { id: 2, stage: 'Stage-1', category: 'KSM', categoryLabel: 'KSM-2', chemicalName: 'Diethyl (3R)-glutarate intermediate', casNumber: '—', qty: 8.20, units: 'Kg', unitCost: 12180, totalCost: 99876, pctTotal: 23.07, source: 'Hubei Vanz', country: 'China', flag: '🇨🇳', leadTime: '2 wks', remarks: '' },
    { id: 3, stage: 'Stage-1', category: 'KSM', categoryLabel: 'KSM-3', chemicalName: 'tert-Butyl dioxane carboxylate', casNumber: '—', qty: 6.80, units: 'Kg', unitCost: 22000, totalCost: 149600, pctTotal: 34.55, source: 'Custom', country: 'India', flag: '🇮🇳', leadTime: '4 wks', remarks: 'Custom synthesis' },
    { id: 4, stage: 'Stage-1', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'Lithium diisopropylamide (LDA)', casNumber: '4111-54-0', qty: 5.50, units: 'Kg', unitCost: 7140, totalCost: 39270, pctTotal: 9.07, source: 'Hubei Vanz', country: 'China', flag: '🇨🇳', leadTime: '2 wks', remarks: '' },
    { id: 5, stage: 'Stage-2', category: 'KSM', categoryLabel: 'Int-1', chemicalName: 'Stage-1 Intermediate', casNumber: '—', qty: 14.50, units: 'Kg', unitCost: 4800, totalCost: 69600, pctTotal: 16.07, source: 'In-house', country: 'India', flag: '🇮🇳', leadTime: '—', remarks: 'From Stage-1' },
    { id: 6, stage: 'Stage-2', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'Sodium borohydride', casNumber: '16940-66-2', qty: 3.00, units: 'Kg', unitCost: 3200, totalCost: 9600, pctTotal: 2.22, source: '', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
    { id: 7, stage: 'Stage-2', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'THF (anhydrous)', casNumber: '109-99-9', qty: 80.00, units: 'Kg', unitCost: 420, totalCost: 33600, pctTotal: 7.76, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1-2 wks', remarks: '' },
    { id: 8, stage: 'Stage-3', category: 'Reagent', categoryLabel: 'Reagent', chemicalName: 'Calcium chloride (anhydrous)', casNumber: '10043-52-4', qty: 4.00, units: 'Kg', unitCost: 180, totalCost: 720, pctTotal: 0.17, source: 'Sai Life', country: 'India', flag: '🇮🇳', leadTime: 'Immed.', remarks: '' },
    { id: 9, stage: 'Stage-3', category: 'General', categoryLabel: 'General', chemicalName: 'Activated carbon (Norit)', casNumber: '7440-44-0', qty: 6.00, units: 'Kg', unitCost: 280, totalCost: 1680, pctTotal: 0.39, source: 'Sai Life', country: 'India', flag: '🇮🇳', leadTime: 'Immed.', remarks: '' },
    { id: 10, stage: 'Stage-3', category: 'Solvent', categoryLabel: 'Solvent', chemicalName: 'Isopropanol', casNumber: '67-63-0', qty: 55.00, units: 'Kg', unitCost: 95, totalCost: 5225, pctTotal: 1.21, source: 'Commercial', country: 'India', flag: '🇮🇳', leadTime: '1 wk', remarks: '' },
  ],
};

export const scenarios = [scenario1, scenario2, scenario3];

// Default export for initial render
export const rfpInfo = scenario1.rfpInfo;
export const emailThread = scenario1.emailThread;
export const tableData = scenario1.tableData;

export const workflowSteps = [
  { id: 1, title: 'Email Trigger', sub: 'Gmail / Outlook webhook', icon: 'email', duration: 800 },
  { id: 2, title: 'Thread Parser', sub: 'Full conversation context', icon: 'parse', duration: 1200 },
  { id: 3, title: 'Data Extraction', sub: 'Chemicals, CAS, prices', icon: 'match', duration: 1400 },
  { id: 4, title: 'Sheet Population', sub: 'Auto-fills structured Excel', icon: 'sheet', duration: 1000 },
];

export const features = [
  { icon: 'email', color: 'blue', title: 'Email-Triggered Workflow', desc: 'No manual uploads. The n8n workflow watches your inbox and triggers when a new quotation email arrives — fully hands-off.', size: 'lg',
    visual: `Trigger: Gmail Webhook\nFilter:  Subject contains "quotation" OR "quote"\n         Body contains CAS numbers\nAction:  → Parse thread → Extract → Populate` },
  { icon: 'parse', color: 'purple', title: 'Thread Context Analysis', desc: 'Reads entire email conversations — not just individual messages — to understand vendor responses in context.', size: 'sm' },
  { icon: 'match', color: 'green', title: 'CAS Number Recognition', desc: 'Auto-identifies chemical compounds by CAS registry numbers and cross-references against known databases.', size: 'sm' },
  { icon: 'sheet', color: 'amber', title: 'Auto-Populated Spreadsheet', desc: 'Structures extracted data into stage-wise bill of materials with cost breakdowns, lead times, and sourcing.', size: 'mid',
    visual: `Stage-1 │ KSM-1    │ Tetrafluoropropanol │ ₹4,400/kg\nStage-1 │ Reagent  │ Triethylamine       │ ₹627/kg\nStage-2 │ Reagent  │ n-BuLi in THF       │ ₹2,800/kg` },
  { icon: 'lock', color: 'slate', title: 'Private & Secure', desc: 'All processing runs locally. Your procurement data never leaves your infrastructure.', size: 'mid' },
  { icon: 'zap', color: 'blue', title: 'Zero Manual Entry', desc: 'From email receipt to structured Excel — end to end, no human input required for standard quotation formats.', size: 'lg' },
];

export const howItWorks = [
  { num: '01', icon: '📨', title: 'Vendor sends email', desc: 'A quotation email hits your inbox with chemical names, quantities, and prices.' },
  { num: '02', icon: '⚡', title: 'n8n workflow triggers', desc: 'The webhook detects quotation keywords and CAS numbers in the thread.' },
  { num: '03', icon: '🧠', title: 'AI parses the thread', desc: 'Full conversation context is analyzed — sender, receiver, items, terms, delivery.' },
  { num: '04', icon: '📊', title: 'Sheet auto-populates', desc: 'Extracted data fills your structured Excel template with all fields mapped.' },
];
