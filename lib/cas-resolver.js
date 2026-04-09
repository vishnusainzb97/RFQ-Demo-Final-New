// cas-resolver.js
// Simulates the Hyma Synthesis API / PubChem for CAS number resolution.

// Pseudo-random deterministic number generator based on a string seed
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate a valid-looking CAS number (Format: \d{2,7}-\d{2}-\d)
// The last digit is a check digit, let's just make it look realistic.
function generateMockCAS(name) {
  const hash = hashCode(name.toLowerCase());
  const part1 = (hash % 90000) + 10000; // 5 digits
  const part2 = (Math.floor(hash / 100) % 90) + 10; // 2 digits
  
  // Calculate check digit (not strictly real mathematical check digit, but formatted)
  const part3 = hash % 10;

  return `${part1}-${part2}-${part3}`;
}

const hardcodedDB = {
  'toluene': '108-88-3',
  'methanol': '67-56-1',
  'ethanol': '64-17-5',
  'acetone': '67-64-1',
  'dichloromethane': '75-09-2',
  'dcm': '75-09-2',
  'thf': '109-99-9',
  'tetrahydrofuran': '109-99-9',
  'acetonitrile': '75-05-8',
  'dimethylformamide': '68-12-2',
  'dmf': '68-12-2',
  'sodium hydroxide': '1310-73-2',
  'hydrochloric acid': '7647-01-0'
};

/**
 * Resolves a CAS number for a given chemical name.
 * @param {string} chemicalName 
 * @returns {Promise<string>}
 */
export async function resolveCASNumber(chemicalName) {
  if (!chemicalName) return null;

  // Simulate API Network Delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

  const lowerName = chemicalName.trim().toLowerCase();
  
  // 1. Check "Hyma Synthesis Internal Database" (Hardcoded)
  if (hardcodedDB[lowerName]) {
    return hardcodedDB[lowerName];
  }

  // 2. "PubChem Fallback" (Mocked via deterministic generation)
  // In a real scenario, this would call fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/...`)
  return generateMockCAS(chemicalName);
}
