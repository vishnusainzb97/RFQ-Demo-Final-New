import { NextResponse } from 'next/server';
import { cleanMailContent } from '../../../lib/mail-cleaner';
import { parseRFQEmail } from '../../../lib/groq-parser';
import { resolveCASNumber } from '../../../lib/cas-resolver';

export async function POST(request) {
  try {
    const { emailText } = await request.json();

    if (!emailText) {
      return NextResponse.json({ error: 'Missing emailText in request body' }, { status: 400 });
    }

    // Step 1: Preprocess email text
    const cleanedText = cleanMailContent(emailText);

    // Step 2: Use Groq API to parse into structured JSON
    const parsedData = await parseRFQEmail(cleanedText);

    // Step 3: Resolve missing CAS numbers and hydrate data
    if (parsedData.items && Array.isArray(parsedData.items)) {
      const enrichedItems = await Promise.all(
        parsedData.items.map(async (item) => {
          if (!item.casNumber || item.casNumber === 'unknown' || item.casNumber.trim() === '') {
            item.casNumber = await resolveCASNumber(item.chemicalName);
          }
          // Compute total cost automatically just in case LLM missed it
          if (item.qty && item.unitCost) {
            item.totalCost = item.qty * item.unitCost;
          } else {
            item.totalCost = 0;
          }
          return item;
        })
      );
      parsedData.items = enrichedItems;
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error in /api/parse:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
