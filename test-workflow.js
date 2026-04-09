import { parseRFQEmail } from './lib/groq-parser.js';
import { resolveCASNumber } from './lib/cas-resolver.js';
import { generateChemvedaExcelBuffer } from './lib/excel-generator.js';
import { cleanMailContent } from './lib/mail-cleaner.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Ensure API key is set
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: Missing GROQ_API_KEY in .env.local file.');
  process.exit(1);
}

const sampleEmail = `
From: procurement@novatek-pharma.com
To: sales@chemveda.com
Subject: Urgent RFQ: Scale-up materials needed for Project X-19

Hi Team,

Hope you are doing well. Please provide your best quote for the following materials urgently required for our synthesis pipeline (Project X-19). Note that we need firm delivery times.

1. Toluene - 50 L
2. Tetrahydrofuran (THF) - 100 L
3. Intermediate: 4-Bromoaniline - 25 kg
4. Key Starting Material (KSM): 2,4-DCP - 10 kg
5. Custom Reagent: Palladium(II) acetate - 50 g

Please let me know if you can ship within 2 weeks.

Best Regards,
Sarah Jenkins
VP Procurement
Novatek Pharma
-- 
CONFIDENTIALITY NOTICE: This email and its attachments are confidential.
`;

async function runDemo() {
  console.log('📨 1. Processing sample RFQ email...\n');
  
  const cleanedText = cleanMailContent(sampleEmail);
  console.log('🤖 2. Sending to Groq (Llama 3.3) for Extraction...');
  
  try {
    const parsedData = await parseRFQEmail(cleanedText);
    
    console.log('\n✅ Extracted Raw Data from LLM:');
    console.log(JSON.stringify(parsedData, null, 2));

    console.log('\n🧪 3. Resolving CAS Numbers via Mocked Hyma API...');
    for (let item of parsedData.items) {
       item.casNumber = await resolveCASNumber(item.chemicalName);
       if (!item.unitCost) item.unitCost = 0;
       item.totalCost = item.qty * item.unitCost;
    }
    
    console.log('\n✅ Enriched Chemical Data with CAS:');
    console.table(parsedData.items);

    console.log('\n📊 4. Generating Chemveda Excel Report...');
    const excelBuffer = generateChemvedaExcelBuffer(parsedData.items, parsedData.rfpInfo || { rfpCode: "RFQ-NOVA", customer: "Novatek" });
    
    fs.writeFileSync('RFQ_Export_Demo.xlsx', excelBuffer);
    console.log('✅ Success! Excel file saved as "RFQ_Export_Demo.xlsx".');
    console.log('\n🎉 Workflow execution complete!');
    
  } catch (err) {
    console.error('\n❌ Workflow failed:', err.message);
  }
}

runDemo();
