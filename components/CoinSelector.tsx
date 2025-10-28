import React from 'react';
import { Coin } from '../types';

interface CoinSelectorProps {
  coins: Coin[];
  selectedCoins: Coin[];
  onCoinSelect: (coin: Coin) => void;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
}

const CoinSelector: React.FC<CoinSelectorProps> = ({ coins, selectedCoins, onCoinSelect, searchQuery, onSearchChange, onClearAll }) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchQuery}
            onChange={onSearchChange}
            className="bg-gray-700/50 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full ps-10 p-2.5 transition-colors duration-200"
            aria-label="Search for a coin"
          />
        </div>
        {selectedCoins.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-2 py-1 transition-colors flex-shrink-0"
            aria-label="Clear all selected coins"
          >
            Clear All
          </button>
        )}
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {coins.map(coin => {
          const isSelected = selectedCoins.some(c => c.id === coin.id);
          const isDisabled = !isSelected && selectedCoins.length >= 2;
          return (
            <button
              key={coin.id}
              onClick={() => onCoinSelect(coin)}
              disabled={isDisabled}
              className={`p-3 text-center rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                ${isSelected
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
                ${!isDisabled ? 'hover:-translate-y-1' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <p className="font-bold text-sm sm:text-base">{coin.name}</p>
              <p className={`text-xs sm:text-sm ${isSelected ? 'text-cyan-100' : 'text-gray-400'}`}>{coin.symbol}</p>
            </button>
          );
        })}
        {coins.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            <p>No coins found matching "{searchQuery}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinSelector;