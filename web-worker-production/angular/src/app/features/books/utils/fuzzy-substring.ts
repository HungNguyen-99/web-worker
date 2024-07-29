export interface FuzzyMatch {
  substringDistance: number;
  startIndex: number;
  endIndex: number;
}

export interface FuzzyMatchSimilarity extends FuzzyMatch {
  similarityScore: number;
}

/**
 * Fuzzy Matching of a needle string within a haystack string. Finds the minimum
 * Modified from http://ginstrom.com/scribbles/2007/12/01/fuzzy-substring-matching-with-levenshtein-distance-in-python
 */
export function fuzzySubstringSimilarity(
  needle: string,
  haystack: string
): FuzzyMatchSimilarity {
  const fuzzyMatch = fuzzySubstring(needle, haystack);

  if (fuzzyMatch.substringDistance === 0) {
    return {
      ...fuzzyMatch,
      similarityScore: 1,
    };
  }

  return {
    ...fuzzyMatch,
    similarityScore: 1 - fuzzyMatch.substringDistance / needle.length,
  };
}

export function fuzzySubstring(needle: string, haystack: string): FuzzyMatch {
  // if the needle is in the haystack, the distance is 0
  const startIndex = haystack.indexOf(needle);
  if (startIndex >= 0) {
    return {
      substringDistance: 0,
      startIndex,
      endIndex: startIndex + needle.length,
    };
  }

  // if the haystack is empty, the distance is the length of the needle (all insertions)
  if (haystack.length === 0) {
    return {
      substringDistance: needle.length,
      startIndex: 0,
      endIndex: 0,
    };
  }

  let minDistance = Infinity;
  let bestStartIndex = 0;

  // Iterate over possible start positions of the needle within the haystack
  for (let start = 0; start <= haystack.length - needle.length; start++) {
    let row1: number[] = new Array(needle.length + 1)
      .fill(0)
      .map((_, idx) => idx);

    for (let i = 0; i < needle.length; i++) {
      const row2: number[] = [i + 1];

      for (let j = 0; j < needle.length; j++) {
        const cost = needle[i] !== haystack[start + j] ? 1 : 0;

        row2.push(
          Math.min(
            row1[j + 1] + 1, // deletion
            row2[j] + 1, // insertion
            row1[j] + cost // substitution
          )
        );
      }

      row1 = row2;
    }

    const distance = row1[needle.length];
    if (distance < minDistance) {
      minDistance = distance;
      bestStartIndex = start;
    }
  }

  return {
    substringDistance: minDistance,
    startIndex: bestStartIndex,
    endIndex: bestStartIndex + needle.length,
  };
}
