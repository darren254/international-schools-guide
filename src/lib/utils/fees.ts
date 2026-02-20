/**
 * Extract the highest fee (in thousands USD) from a fee range string.
 * Examples:
 *   "US$17K – US$36K" → 36
 *   "US$5K – US$10K" → 10
 *   "US$9.2K – US$30K" → 30
 *   "US$12K – $22K" → 22 (handles both US$ and $)
 */
export function extractHighestFee(feeRange: string): number {
  // Extract all fee values from the string (handles US$XXK, $XXK, or XXK)
  const allMatches = feeRange.matchAll(/US?\$?(\d+(?:\.\d+)?)K/gi);
  const fees = Array.from(allMatches, (m) => parseFloat(m[1]));
  
  // Return the highest fee, or 0 if no matches found
  return fees.length > 0 ? Math.max(...fees) : 0;
}

/**
 * Extract the lowest fee (in thousands USD) from a fee range string.
 */
export function extractLowestFee(feeRange: string): number {
  const allMatches = feeRange.matchAll(/US?\$?(\d+(?:\.\d+)?)K/gi);
  const fees = Array.from(allMatches, (m) => parseFloat(m[1]));
  return fees.length > 0 ? Math.min(...fees) : 0;
}
