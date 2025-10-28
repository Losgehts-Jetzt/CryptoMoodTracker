export enum Mood {
  EXCITED = 'Excited',
  SCARED = 'Scared',
  CRAPPED = 'Crapped',
  UNKNOWN = 'Unknown',
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface Source {
  summary: string;
  uri: string;
}

export interface MoodResultData {
  mood: Mood;
  reason: string;
  sources: Source[];
}

export type CoinMoodResult = MoodResultData & { coin: Coin };