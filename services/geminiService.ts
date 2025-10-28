import { GoogleGenAI } from "@google/genai";
import { Coin, Mood, MoodResultData, Source } from '../types';

const parseMood = (moodStr: string): Mood => {
  const lowerMood = moodStr.toLowerCase();
  if (lowerMood.includes('excited')) return Mood.EXCITED;
  if (lowerMood.includes('scared')) return Mood.SCARED;
  if (lowerMood.includes('crapped')) return Mood.CRAPPED;
  return Mood.UNKNOWN;
};

export const getMoodForCoin = async (coin: Coin): Promise<MoodResultData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Based on the absolute latest news, social media posts, and overall market sentiment for ${coin.name} (${coin.symbol}), what is the current mood?

    The mood must be one of three options: "Excited", "Scared", or "Crapped".
    - "Excited": Very positive, bullish sentiment.
    - "Scared": Mixed, uncertain, or cautious sentiment.
    - "Crapped": Very negative, bearish sentiment.
    
    Provide a brief, one-sentence explanation for the mood. Then, list up to 2 of the most influential sources you used, providing a one-line summary and the URL for each.

    Format your response EXACTLY as follows:
    MOOD: [Your chosen mood]
    REASON: [A brief, one-sentence explanation for the mood.]
    ---SOURCES---
    SUMMARY: [One-line summary for source 1]
    URL: [Full URL for source 1]
    SUMMARY: [One-line summary for source 2]
    URL: [Full URL for source 2]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text.trim();
    const lines = text.split('\n');

    let mood: Mood = Mood.UNKNOWN;
    let reason: string = "Could not determine the reason from the AI's response.";
    const sources: Source[] = [];

    const moodLine = lines.find(line => line.toUpperCase().startsWith('MOOD:'));
    if (moodLine) {
      mood = parseMood(moodLine.substring(5).trim());
    }

    const reasonLine = lines.find(line => line.toUpperCase().startsWith('REASON:'));
    if (reasonLine) {
      reason = reasonLine.substring(7).trim();
    }
    
    if (mood === Mood.UNKNOWN) {
        reason = `AI response was not in the expected format: "${text}"`;
    }

    const sourcesHeaderIndex = lines.findIndex(line => line.includes('---SOURCES---'));
    if (sourcesHeaderIndex > -1) {
      for (let i = sourcesHeaderIndex + 1; i < lines.length; i += 2) {
        const summaryLine = lines[i];
        const urlLine = lines[i+1];

        if (summaryLine && urlLine && summaryLine.toUpperCase().startsWith('SUMMARY:') && urlLine.toUpperCase().startsWith('URL:')) {
          sources.push({
            summary: summaryLine.substring(8).trim(),
            uri: urlLine.substring(4).trim(),
          });
        }
      }
    }

    return { mood, reason, sources };
  } catch (error) {
    console.error(`Error calling Gemini API for ${coin.name}:`, error);
    throw new Error(`An error occurred while fetching mood for ${coin.name} from Gemini API.`);
  }
};