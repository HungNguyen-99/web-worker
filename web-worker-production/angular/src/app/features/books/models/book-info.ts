export enum BookChoice {
  AliceInWonderland = 'AliceInWonderland',
  SherlockHolmes = 'SherlockHolmes',
  WarAndPeace = 'WarAndPeace',
}

export interface BookInfo {
  url: string;
  name: string;
}

export const books: Record<BookChoice, BookInfo> = {
  [BookChoice.AliceInWonderland]: {
    url: 'assets/books/alice.txt',
    name: 'Alice in Wonderland',
  },
  [BookChoice.SherlockHolmes]: {
    url: 'assets/books/sherlock.txt',
    name: 'Sherlock Holmes',
  },
  [BookChoice.WarAndPeace]: {
    url: 'assets/books/war-and-peace.txt',
    name: 'War and Peace',
  },
};
