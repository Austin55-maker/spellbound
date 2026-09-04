import React from 'react';

export interface ScrambledLetter {
  id: string;
  char: string;
  used: boolean;
  rotation: number;
  colorClass: string;
}

interface ScrambledLettersProps {
  letters: ScrambledLetter[];
  onLetterClick: (char: string, index: number) => void;
  disabled?: boolean;
}

const ScrambledLetters: React.FC<ScrambledLettersProps> = ({ letters, onLetterClick, disabled }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 select-none touch-manipulation flex flex-wrap justify-center gap-3 sm:gap-5">
      {letters.map((letter, index) => {
        return (
          <button
            key={letter.id}
            onClick={() => {
              if (!disabled && !letter.used) {
                onLetterClick(letter.char, index);
              }
            }}
            disabled={disabled || letter.used}
            style={{
              transform: !letter.used ? `rotate(${letter.rotation}deg)` : 'scale(0.8) translateY(12px)',
            }}
            className={`
              relative
              h-16 w-16 sm:h-20 sm:w-20
              text-2xl sm:text-4xl font-extrabold rounded-2xl
              flex items-center justify-center
              border-b-[6px] active:border-b-0 active:translate-y-[6px]
              transition-all duration-300 ease-out
              shadow-lg
              ${letter.used 
                ? 'opacity-0 scale-50 pointer-events-none translate-y-4 duration-500' 
                : `${letter.colorClass} hover:scale-110 active:scale-95 cursor-pointer`
              }
            `}
          >
            {/* Playful letter face */}
            <span className="block drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">
              {letter.char}
            </span>

            {/* Visual small cute shadow/shine effect */}
            <span className="absolute top-1 left-2 text-[10px] sm:text-sm font-black text-white/40 pointer-events-none">
              ✦
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ScrambledLetters;
