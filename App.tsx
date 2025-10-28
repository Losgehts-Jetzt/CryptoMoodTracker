import React, { useState, useCallback } from 'react';
import { Coin, CoinMoodResult } from './types';
import { COINS } from './constants';
import { getMoodForCoin } from './services/geminiService';
import CoinSelector from './components/CoinSelector';
import MoodResult from './components/MoodResult';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [selectedCoins, setSelectedCoins] = useState<Coin[]>([]);
  const [moodResult, setMoodResult] = useState<CoinMoodResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCoinSelect = useCallback((coin: Coin) => {
    setSelectedCoins(prevSelected => {
      const isSelected = prevSelected.some(c => c.id === coin.id);
      if (isSelected) {
        // Clear error when deselecting a coin
        if (error === "You can only select a maximum of 2 coins.") {
            setError(null);
        }
        return prevSelected.filter(c => c.id !== coin.id);
      } else {
        if (prevSelected.length >= 2) {
          setError("You can only select a maximum of 2 coins.");
          // Clear the message after 3 seconds
          setTimeout(() => setError(null), 3000);
          return prevSelected;
        }
        return [...prevSelected, coin];
      }
    });
  }, [error]);

  const handleClearAll = useCallback(() => {
    setSelectedCoins([]);
    if (error === "You can only select a maximum of 2 coins.") {
        setError(null);
    }
  }, [error]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedCoins.length === 0) {
      setError("Please select at least one coin.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMoodResult(null);

    try {
      const moodPromises = selectedCoins.map(coin => getMoodForCoin(coin));
      const results = await Promise.all(moodPromises);
      
      const combinedResults: CoinMoodResult[] = selectedCoins.map((coin, index) => ({
        coin: coin,
        mood: results[index].mood,
        reason: results[index].reason,
        sources: results[index].sources,
      }));

      setMoodResult(combinedResults);
    } catch (err) {
      setError("Failed to determine mood. The AI might be feeling down. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCoins = COINS.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Crypto Mood Tracker
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Select up to 2 crypto assets to gauge the market's vibe.
          </p>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-cyan-300">1. Choose Your Coins</h2>
          <CoinSelector
            coins={filteredCoins}
            selectedCoins={selectedCoins}
            onCoinSelect={handleCoinSelect}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearAll={handleClearAll}
          />
          
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading || selectedCoins.length === 0}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <span className="relative px-8 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
                {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
                {isLoading ? 'Analyzing Sentiment...' : `Get The Mood (${selectedCoins.length})`}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 text-center p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 transition-opacity duration-300">
            <p>{error}</p>
          </div>
        )}

        {moodResult && (
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-cyan-300">2. The Verdict</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {moodResult.map((result) => (
                    <MoodResult key={result.coin.id} result={result} />
                ))}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Mood analysis powered by Gemini. Data is for informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;