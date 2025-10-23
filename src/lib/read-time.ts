/**
 * Simple read time calculation based on word count and content complexity
 *
 * This utility provides reading time estimates by:
 * - Counting words accurately
 * - Adjusting for technical content complexity
 * - Formatting output consistently
 */

export interface ReadTimeResult {
  minutes: number;
  seconds: number;
  formatted: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Basic word counting that handles Markdown syntax
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Main function to calculate read time for content
 */
export function calculateReadTime(content: string): ReadTimeResult {
  // Extract plain text from MDX content
  const plainText = content.replace(/^---[\s\S]*?[\s\S]*?---[\s\S]*?/, '')
    .replace(/```[\s\S]*?[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .trim();

  // Count words
  const words = countWords(plainText);

  // Base reading speed with technical adjustment
  const baseReadingSpeed = 200; // Average reading speed
  let complexityMultiplier = 1.0;

  // Adjust for technical content
  const codeBlocks = (content.match(/```/g) || []).length;
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;
  const lists = (content.match(/^\s*[-*+]\s/gm) || []).length;

  if (codeBlocks > 0) complexityMultiplier += 0.4;
  if (headings > 3) complexityMultiplier += 0.2;
  if (lists > 2) complexityMultiplier += 0.1;

  // Calculate adjusted reading speed
  const adjustedSpeed = baseReadingSpeed / complexityMultiplier;

  // Calculate total reading time
  const totalMinutes = Math.max(1, words / adjustedSpeed);
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);

  // Format output
  let formatted = '';
  if (minutes === 1) {
    formatted = '1 min read';
  } else if (seconds > 0) {
    formatted = `${minutes} min ${seconds} sec read`;
  } else {
    formatted = `${minutes} min read`;
  }

  // Determine confidence based on complexity
  let confidence: 'high' | 'medium' | 'low';
  if (complexityMultiplier < 1.2) {
    confidence = 'high';
  } else if (complexityMultiplier < 1.3) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    minutes: totalMinutes + (seconds / 60),
    seconds,
    formatted,
    confidence,
  };
}