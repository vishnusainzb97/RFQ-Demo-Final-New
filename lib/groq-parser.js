import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function parseRFQEmail(emailText) {
  const prompt = `You are a chemical procurement AI assistant. Extract Request for Quote (RFQ) items from the following email thread.

Return valid JSON in this exact structure:
{
  "rfpInfo": {
    "rfpCode": "...",
    "customer": "...",
    "product": "...",
    "date": "...",
    "quantity": "..."
  },
  "items": [
    {
      "stage": "integer or string (e.g. 1 or 'Stage-1')",
      "categoryLabel": "KSM / Key Starting Material / Intermediate / Reagent / Solvent",
      "chemicalName": "...",
      "casNumber": "...",
      "qty": "number",
      "units": "string (kg, g, L, etc)",
      "unitCost": "number (rate per unit in INR if specified, else 0)",
      "source": "...",
      "country": "...",
      "leadTime": "..."
    }
  ]
}

Email Thread:
${emailText}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq');
    
    const json = JSON.parse(content);
    return json;
  } catch (err) {
    console.error('Error parsing with Groq:', err);
    throw err;
  }
}
