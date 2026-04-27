export const rfpInfo = {
  rfpCode: 'RFQ-NOVA-2026',
  customer: 'Novatek Pharma',
  product: 'API Synthesis Campaign',
  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  scale1: '500g & 1kg',
  scale2: '2.5 kg GMP Batch with 20% contingency',
  scale3: '5.0 kg GMP Batch with 20% contingency',
  scale4: '10.0 kg GMP with 10% contingency +stability + reference standards'
};

export const chemicalsData = [
  {
    stage: 'Stage-1\nFragment-2',
    category: 'KSM',
    chemicalName: '4-Bromoaniline',
    casNo: '591-19-5',
    qty: 500,
    unit: 'g',
    density: null,
    molWt: 172.02,
    moles: 2.906,
    moleEq: 1,
    ratio: 1,
    summaryQty: '4kg/10kg',
    catalogNo: 'CAT-BA-0591',
    warehouseStock: '2.3 kg',
    purity: '≥98%',
    storageCondition: 'Room temperature, dry',
    vendorQuotes: [
      { vendor: 'Angene', price: '976$/3.9kg ; 2345$/10kg', leadTime: '4kg=3-4Weeks ; 10kg=6-7Weeks', remarks: '' },
      { vendor: 'Avra', price: '840$/3.9kg', leadTime: '2-3Weeks', remarks: '' },
      { vendor: 'Senn Chem', price: '270$/kg for 3.9kg ; 200$/kg for 10kg', leadTime: '3.9kg=2-3Weeks ; 5-6Weeks=10kg', remarks: '' },
      { vendor: 'ABC', price: '329$/kg for 4kg ; 280$/kg for 10kg', leadTime: '4-5Weeks', remarks: '' },
      { vendor: 'XYZ', price: '300$/kg for 3.9kg-10kg', leadTime: '2-3Weeks', remarks: '' }
    ],
    scales: [
      { qty: 1.5, units: 'Kg', unitCost: 3500, totalCost: 5250, source: 'Angene', country: 'China', leadTime: '3 weeks', remarks: '' },
      { qty: 2.5, units: 'Kg', unitCost: 3300, totalCost: 8250, source: 'ABC', country: 'China', leadTime: '4 weeks', remarks: '' },
      { qty: 5.0, units: 'Kg', unitCost: 3100, totalCost: 15500, source: 'XYZ', country: 'India', leadTime: '3 weeks', remarks: '' }
    ]
  },
  {
    stage: '',
    category: 'Reagent',
    chemicalName: 'Palladium(II) acetate',
    casNo: '3375-31-3',
    qty: 756.28,
    unit: 'g',
    density: null,
    molWt: 224.5,
    moles: 3.368,
    moleEq: 1.5,
    ratio: 1.51,
    summaryQty: '3.2kg/7.9kg',
    catalogNo: 'CAT-PD-3375',
    warehouseStock: '500 g',
    purity: '≥99%',
    storageCondition: 'Inert atmosphere, 2-8°C',
    vendorQuotes: [
      { vendor: 'ABC', price: '245$/3.2kg ; 460$/7.9kg', leadTime: '2-3Weeks', remarks: '' },
      { vendor: 'XYZ', price: '90$/kg for 3.2kg ; 70$/kg for 7.9kg', leadTime: '2-3Weeks', remarks: '' },
      { vendor: 'Avra', price: '160$/3200G ; 316$/7900G', leadTime: '2-3Weeks', remarks: '' }
    ],
    scales: [
      { qty: 2.32, units: 'Kg', unitCost: 20000, totalCost: 46400, source: 'Avra', country: 'India', leadTime: '1 week', remarks: '2.5 Ltr pack' },
      { qty: 5.87, units: 'Kg', unitCost: 19000, totalCost: 111530, source: 'ABC', country: 'India', leadTime: '1 week', remarks: '' },
      { qty: 14.69, units: 'Kg', unitCost: 18500, totalCost: 271765, source: 'XYZ', country: 'India', leadTime: '1 week', remarks: '' }
    ]
  },
  {
    stage: '',
    category: 'Solvent',
    chemicalName: 'Toluene',
    casNo: '108-88-3',
    qty: 4400,
    unit: 'g',
    density: 0.867,
    molWt: 92.14,
    moles: null,
    moleEq: 10,
    ratio: 8.8,
    summaryQty: '6.3kg/15.6kg',
    catalogNo: 'CAT-TL-1088',
    warehouseStock: '45 kg (drum)',
    purity: 'ACS grade ≥99.5%',
    storageCondition: 'Flammable storage, <25°C',
    vendorQuotes: [
      { vendor: 'Commercial', price: '4870$/6.3KG ; 11400$/15.6KG', leadTime: '2-3Weeks', remarks: '' },
      { vendor: 'ABC', price: '780$/kg for 6.3kg ; 750$/kg for 15.6kg', leadTime: '2-3Weeks', remarks: '' },
    ],
    scales: [
      { qty: 13.5, units: 'Kg', unitCost: 150, totalCost: 2025, source: 'Commercial', country: 'India', leadTime: '1 week', remarks: '180kg Drum' },
      { qty: 34.2, units: 'Kg', unitCost: 120, totalCost: 4104, source: 'ABC', country: 'India', leadTime: '1 week', remarks: '' },
      { qty: 85.5, units: 'Kg', unitCost: 110, totalCost: 9405, source: 'XYZ', country: 'India', leadTime: '1 week', remarks: '' }
    ]
  },
  {
    stage: 'Stage-2\nFragment-3',
    category: 'KSM',
    chemicalName: 'Dichloromethane (DCM)',
    casNo: '75-09-2',
    qty: 685.9,
    unit: 'g',
    density: 1.33,
    molWt: 84.93,
    moles: 8.07,
    moleEq: 1.2,
    ratio: 1.37,
    summaryQty: '2.8kg/7kg',
    catalogNo: 'CAT-DC-7509',
    warehouseStock: '12 kg',
    purity: 'HPLC grade ≥99.8%',
    storageCondition: 'Cool, ventilated area',
    vendorQuotes: [
      { vendor: 'Avra', price: '175$/2.8kg ; 355$/7kg', leadTime: '2-3Weeks', remarks: '' },
      { vendor: 'Senn Chem', price: '100$/kg for 2.8kg ; 70$/kg for 7kg', leadTime: '3-4Weeks', remarks: '' },
      { vendor: 'XYZ', price: '326$/2.8kg ; 420$/7000g', leadTime: '2-3Weeks', remarks: '' }
    ],
    scales: [
      { qty: 2.11, units: 'Kg', unitCost: 250, totalCost: 527.5, source: 'Avra', country: 'India', leadTime: '1 week', remarks: '2.5 Ltr pack' },
      { qty: 5.33, units: 'Kg', unitCost: 240, totalCost: 1279.2, source: 'ABC', country: 'India', leadTime: '1 week', remarks: '2*2.5L,500ML' },
      { qty: 13.32, units: 'Kg', unitCost: 230, totalCost: 3063.6, source: 'XYZ', country: 'India', leadTime: '1 week', remarks: '5*2.5L,2*500ML' }
    ]
  }
];

export const mockEmailThread = [
  {
    id: 1,
    role: 'buyer',
    sender: 'Sarah Jenkins',
    company: 'Novatek Pharma',
    time: '2 days ago',
    body: `Hi Partners,\\n\\nPlease provide scaling quotes for 4kg and 10kg batches of 4-Bromoaniline, along with other intermediates detailed in the attachment for RFQ-NOVA-2026. Lead times are critical.\\n\\nThanks,\\nSarah`,
    highlights: ['4kg', '10kg', '4-Bromoaniline']
  },
  {
    id: 2,
    role: 'vendor',
    sender: 'Angene Sales',
    company: 'Angene',
    time: 'Yesterday',
    body: `Dear Sarah,\\n\\nWe can supply the requested 4-Bromoaniline. \\nRate: 976$/3.9kg or 2345$/10kg.\\nLead times would be 3-4 Weeks for 4kg, and 6-7 Weeks for 10kg batches.\\n\\nRegards,\\nAngene Team`,
    highlights: ['976$/3.9kg', '2345$/10kg', '3-4 Weeks', '6-7 Weeks']
  },
  {
    id: 3,
    role: 'vendor',
    sender: 'Senn Chem Rep',
    company: 'Senn Chem',
    time: 'Yesterday',
    body: `Hi Sarah,\\nOur quote for the 4-Bromoaniline is 270$/kg for 3.9kg, and 200$/kg for 10kg. Lead time is 5-6 weeks for the larger batch.\\nFor the DCM, we can do 100$/kg for 2.8kg.\\n\\nBest, Senn`,
    highlights: ['270$/kg', '200$/kg', '100$/kg']
  },
  {
    id: 4,
    role: 'vendor',
    sender: 'Avra Desk',
    company: 'Avra',
    time: '5 hours ago',
    body: `Greetings,\\n\\nPalladium(II) acetate is available: 160$/3200G and 316$/7900G (2-3 Weeks).\\nFor Toluene we can't compete right now but we can do DCM at 175$/2.8kg and 355$/7kg.\\n\\nLet us know,\\nAvra`,
    highlights: ['160$/3200G', '316$/7900G', '175$/2.8kg']
  }
];

export const scenarios = [
  {
    rfpInfo: rfpInfo,
    emailThread: mockEmailThread,
    tableData: chemicalsData
  }
];

export const workflowSteps = [
  { id: 'gmail', icon: 'email', title: 'Gmail Trigger', sub: 'New vendor email', duration: 800 },
  { id: 'groq', icon: 'parse', title: 'Llama 3.3', sub: 'Extracts structured data', duration: 1500 },
  { id: 'cas', icon: 'match', title: 'API Sync', sub: 'Resolves CAS numbers', duration: 1000 },
  { id: 'excel', icon: 'sheet', title: 'Generate .xlsx', sub: 'Chemveda RFQ template', duration: 600 }
];

export const howItWorks = [
  { num: '1', icon: '📨', title: 'Fetch Email', desc: 'n8n pulls the threaded email securely from inbox.' },
  { num: '2', icon: '🧠', title: 'Data Extraction', desc: 'Groq API extracts chemicals, scales, and constraints.' },
  { num: '3', icon: '🔬', title: 'CAS Check', desc: 'Mocked lookup verifies CAS numbers.' },
  { num: '4', icon: '📊', title: 'Generate Excel', desc: 'Creates Chemveda styled formatted Excel spreadsheet.' }
];

export const features = [
  { icon: 'email', title: 'Automated Inbox Scanning', desc: 'n8n actively monitors your email inbox for new vendor quotes and procurement communications in real time.', size: 'lg', color: 'blue', visual: 'IMAP Trigger → Parse → Route → Store\n→ Auto-classify: RFQ / Quote / Follow-up' },
  { icon: 'parse', title: 'Llama 3.3 Extraction', desc: 'Groq API extracts complex chemical entities, pricing, lead times, and constraints from unstructured email text.', size: 'sm', color: 'purple' },
  { icon: 'match', title: 'CAS Validation', desc: 'Ensures correct chemical registry numbers are matched and verified against authoritative databases.', size: 'sm', color: 'green' },
  { icon: 'sheet', title: 'Excel Delivery', desc: 'Produces client-ready stylized Excel files with conditional formatting, multi-sheet workbooks, and audit trails.', size: 'sm', color: 'amber' },
  { icon: 'lock', title: 'Data Privacy & Compliance', desc: 'All processing runs locally on your infrastructure. No chemical data leaves your network.', size: 'sm', color: 'slate' },
  { icon: 'zap', title: 'End-to-End Automation', desc: 'From email receipt to spreadsheet delivery — zero manual intervention required in the entire pipeline.', size: 'lg', color: 'teal', visual: 'Email → AI Parse → CAS Verify → Excel\nProcessing time: ~4 seconds average' },
];
