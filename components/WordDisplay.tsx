import React from 'react';

interface WordDisplayProps {
  targetWord: string;
  currentIndex: number;
  isShake: boolean;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ targetWord, currentIndex, isShake }) => {
  return (
    <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 my-2 sm:my-12 px-2 ${isShake ? 'shake' : ''}`}>
      {targetWord.split('').map((char, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={index}
            className={`
              w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24
              flex items-center justify-center
              text-3xl sm:text-5xl font-black rounded-xl border-b-8
              transition-all duration-300
              ${isCompleted 
                ? 'bg-green-400 border-green-600 text-white transform -translate-y-1' 
                : isCurrent
                  ? 'bg-white dark:bg-slate-800 border-blue-400 dark:border-blue-500 text-blue-900 dark:text-blue-200 animate-pulse border-2'
                  : 'bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-transparent border-2 border-dashed'
              }
            `}
          >
            {isCompleted ? char : ''}
          </div>
        );
      })}
    </div>
  );
};

export default WordDisplay;