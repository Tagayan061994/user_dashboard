/**
 * Search utilities for optimized text search
 */

// Prepare text for search (lowercase, remove extra spaces)
export const normalizeText = (text: string): string => {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Create a map of normalized text tokens for faster search
export function createSearchableIndex<T>(
  items: T[],
  getFields: (item: T) => string[]
): Map<T, Set<string>> {
  const index = new Map<T, Set<string>>();

  for (const item of items) {
    const allFields = getFields(item);
    const allTokens = new Set<string>();

    for (const field of allFields) {
      if (!field) continue;

      // Normalize and tokenize the field
      const normalizedField = normalizeText(field);
      const tokens = normalizedField.split(/\s+/);

      // Add tokens to the set
      for (const token of tokens) {
        if (token.length >= 2) { // Skip very short tokens
          allTokens.add(token);

          // Also add partial prefixes for autocomplete functionality
          if (token.length > 3) {
            for (let i = 3; i < token.length; i++) {
              allTokens.add(token.substring(0, i));
            }
          }
        }
      }
    }

    index.set(item, allTokens);
  }

  return index;
}

// Search function using the searchable index
export function searchItems<T>(
  index: Map<T, Set<string>>,
  query: string,
  limit?: number
): T[] {
  if (!query || query.trim() === '') {
    return limit ? Array.from(index.keys()).slice(0, limit) : Array.from(index.keys());
  }

  const normalizedQuery = normalizeText(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(token => token.length >= 2);

  if (queryTokens.length === 0) {
    return limit ? Array.from(index.keys()).slice(0, limit) : Array.from(index.keys());
  }

  // Score each item based on query tokens
  const scores = new Map<T, number>();

  for (const [item, tokens] of index.entries()) {
    let score = 0;

    for (const queryToken of queryTokens) {
      // Exact token match (highest score)
      if (tokens.has(queryToken)) {
        score += 10;
        continue;
      }

      // Prefix match (medium score)
      let prefixMatch = false;
      for (const token of tokens) {
        if (token.startsWith(queryToken)) {
          score += 5;
          prefixMatch = true;
          break;
        }
      }
      if (prefixMatch) continue;

      // Substring match (lowest score)
      for (const token of tokens) {
        if (token.includes(queryToken)) {
          score += 1;
          break;
        }
      }
    }

    if (score > 0) {
      scores.set(item, score);
    }
  }

  // Sort by score (descending) and return
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item)
    .slice(0, limit);
}
