import React from 'react';
import { Mood, CoinMoodResult } from '../types';
import { ExcitedIcon } from './icons/ExcitedIcon';
import { ScaredIcon } from './icons/ScaredIcon';
import { CrappedIcon } from './icons/CrappedIcon';

interface MoodResultProps {
  result: CoinMoodResult;
}

const moodConfig = {
  [Mood.EXCITED]: {
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500',
    textColor: 'text-green-300',
    icon: <ExcitedIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
    title: "Excited!",
    description: "Sentiment is overwhelmingly positive.",
  },
  [Mood.SCARED]: {
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-300',
    icon: <ScaredIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
    title: "Scared",
    description: "Sentiment is mixed and uncertain.",
  },
  [Mood.CRAPPED]: {
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500',
    textColor: 'text-red-300',
    icon: <CrappedIcon className="w-16 h-16 sm:w-20 sm:h-20" />,
    title: "Crapped",
    description: "Sentiment is highly negative.",
  },
  [Mood.UNKNOWN]: {
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500',
    textColor: 'text-gray-300',
    icon: <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl">?</div>,
    title: "Unknown",
    description: "The mood is unclear at the moment.",
  },
};

const MoodResult: React.FC<MoodResultProps> = ({ result }) => {
  const { coin, mood, reason, sources } = result;
  const config = moodConfig[mood] || moodConfig[Mood.UNKNOWN];

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border ${config.borderColor} ${config.bgColor} shadow-lg flex flex-col h-full`}>
      <div className="flex-grow">
        <h4 className="text-xl font-bold text-gray-100 mb-1">{coin.name} <span className="text-gray-400 font-normal">({coin.symbol})</span></h4>
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
          <div className={`flex-shrink-0 ${config.textColor}`}>
            {config.icon}
          </div>
          <div className="text-center sm:text-left">
            <h3 className={`text-3xl sm:text-4xl font-bold ${config.textColor}`}>{config.title}</h3>
            <p className="text-gray-400 mt-1">{config.description}</p>
            <p className="mt-4 text-lg text-gray-200 italic">"{reason}"</p>
          </div>
        </div>
      </div>
      
      {sources.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="font-semibold text-gray-300 mb-3">Supporting Sources:</h4>
          <ul className="space-y-4">
            {sources.map((source, index) => (
              <li key={index}>
                <p className="text-gray-300 mb-1">{source.summary}</p>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm hover:underline transition-colors"
                >
                  <span>Read more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoodResult;