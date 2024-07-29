import {
  Observable,
  asyncScheduler,
  from,
  map,
  observeOn,
  scan,
  startWith,
  tap,
} from 'rxjs';
import {
  FuzzyMatchSimilarity,
  fuzzySubstringSimilarity,
} from './fuzzy-substring';

export interface MatchParagraph {
  before: string;
  match: string;
  after: string;
  score: number;
}

export interface SearchResult {
  paragraphs: MatchParagraph[];
  searchedParagraphCount: number;
  paragraphCount: number;
}

export interface SearchMatch {
  searchTerm: string;
  paragraph: string;
  paragraphNumber: number;
  searchMatch: FuzzyMatchSimilarity;
}

export function getAccumulatedSearchResults(
  searchTerm: string,
  paragraphs: string[]
): Observable<SearchResult> {
  console.log(searchTerm);
  return getSearchResults(searchTerm, paragraphs).pipe(
    accumulateResults(paragraphs.length)
  );
}

export function accumulateResults(paragraphCount: number) {
  return (obs$: Observable<SearchMatch>): Observable<SearchResult> => {
    return obs$.pipe(
      scan(
        (searchResults: SearchMatch[], searchResult: SearchMatch) => [
          ...searchResults,
          searchResult,
        ],
        []
      ),
      startWith([]),
      tap((searchResults) => console.log(searchResults)),
      map((searchMatches: SearchMatch[], index): SearchResult => {
        const last = searchMatches[searchMatches.length - 1];
        return {
          searchedParagraphCount: last ? last.paragraphNumber + 1 : 0,
          paragraphCount,
          paragraphs: searchMatches
            .sort(
              (a, b) =>
                b.searchMatch.similarityScore - a.searchMatch.similarityScore
            )
            .slice(0, 10)
            .map(({ searchMatch, paragraph }) => {
              return {
                score: searchMatch.similarityScore,
                match: paragraph.substring(
                  searchMatch.startIndex,
                  searchMatch.endIndex
                ),
                before: paragraph.substring(0, searchMatch.startIndex),
                after: paragraph.substring(searchMatch.endIndex),
              };
            }),
        };
      })
    );
  };
}

export function getSearchResults(
  searchTerm: string,
  paragraphs: string[]
): Observable<SearchMatch> {
  return from(paragraphs).pipe(
    observeOn(asyncScheduler),
    map((paragraph, index) => {
      const searchMatch = fuzzySubstringSimilarity(searchTerm, paragraph);
      return {
        searchMatch,
        paragraph,
        paragraphNumber: index,
        searchTerm,
      };
    })
  );
}
