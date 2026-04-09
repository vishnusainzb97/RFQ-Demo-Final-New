export function cleanMailContent(rawText) {
  if (!rawText) return '';

  // 1. Remove excessive whitespace
  let text = rawText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  // 2. Remove common signature blocks from vendor emails
  const sigIndicators = [
    '-- ',
    'Best Regards',
    'Best regards',
    'Warm Regards',
    'Thanks & Regards',
    'CONFIDENTIALITY NOTICE',
    'This email and any files transmitted',
  ];

  for (const sig of sigIndicators) {
    const idx = text.indexOf(sig);
    if (idx !== -1) {
      // Optional: keep first few lines or just cut. Let's do a simple slice for basic signatures.
      // But don't cut if it's too high up the email (e.g., in a forwarded thread).
      if (idx > text.length * 0.1) {
         // text = text.substring(0, idx);
      }
    }
  }

  // Actually, LLMs are great at ignoring signatures, but cleaning up inline quotes saves tokens.
  const lines = text.split('\n');
  const cleanedLines = [];
  let inQuoteBlock = false;

  for (const line of lines) {
    if (line.match(/^>\s*/)) {
      if (!inQuoteBlock) {
        cleanedLines.push('[...quoted text omitted...]');
        inQuoteBlock = true;
      }
      continue;
    } else {
      inQuoteBlock = false;
      cleanedLines.push(line);
    }
  }

  return cleanedLines.join('\n');
}
