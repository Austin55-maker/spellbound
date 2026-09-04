import React from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void;
  disabled: boolean;
}

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, disabled }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-1 sm:px-4 select-none touch-manipulation">
      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
          {row.map((char) => (
            <button
              key={char}
              onClick={() => !disabled && onKeyPress(char)}
              disabled={disabled}
              className={`
                relative
                h-12 w-[8.6vw] xs:w-[8.8vw] sm:h-14 sm:w-12 md:h-16 md:w-14 lg:w-16 max-w-[48px]
                text-base xs:text-lg sm:text-xl font-bold rounded-lg
                flex items-center justify-center
                transition-all duration-100
                shadow-[0_3px_0_rgb(0,0,0,0.15)] dark:shadow-[0_3px_0_rgb(0,0,0,0.4)]
                active:shadow-none active:translate-y-[2px]
                ${disabled 
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none translate-y-[1px]' 
                  : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-indigo-100 dark:border-slate-600'}
              `}
            >
              {char}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;