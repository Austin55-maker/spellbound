import React, { useState, useEffect, useCallback } from 'react';
import { generateWordList, generateCustomGameWords, getCustomWords, deleteCustomWord, getCustomVictoryMessage } from './services/wordService';
import { audioService } from './services/audioService';
import ScrambledLetters, { ScrambledLetter } from './components/ScrambledLetters';
import WordDisplay from './components/WordDisplay';
import Button from './components/Button';
import AdminPanel from './components/AdminPanel';
import SettingsPanel from './components/SettingsPanel';
import ProfilePanel from './components/ProfilePanel';
import LegalModal, { LegalModalType } from './components/LegalModal';
import { Difficulty, GameState, SpellingWord, CustomWord, AppSettings, PlayerProfile } from './types';

// Icons
const VolumeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

const PLAYFUL_COLORS = [
  'bg-amber-450 border-amber-500 text-white dark:bg-amber-500 dark:border-amber-600',
  'bg-pink-400 border-pink-500 text-white dark:bg-pink-500 dark:border-pink-600',
  'bg-teal-400 border-teal-500 text-white dark:bg-teal-500 dark:border-teal-600',
  'bg-purple-400 border-purple-500 text-white dark:bg-purple-650 dark:border-purple-700',
  'bg-sky-450 border-sky-500 text-white dark:bg-sky-500 dark:border-sky-600',
  'bg-rose-400 border-rose-500 text-white dark:bg-rose-500 dark:border-rose-600',
  'bg-emerald-400 border-emerald-500 text-white dark:bg-emerald-500 dark:border-emerald-600',
];

const generateScrambledLetters = (word: string): ScrambledLetter[] => {
  if (!word) return [];
  const chars = word.split('');
  const letters: ScrambledLetter[] = chars.map((char, index) => {
    const rotation = Math.floor(Math.random() * 17) - 8; // -8 to 8
    const colorClass = PLAYFUL_COLORS[index % PLAYFUL_COLORS.length];
    return {
      id: `${char}-${index}-${Math.random()}`,
      char: char.toUpperCase(),
      used: false,
      rotation,
      colorClass,
    };
  });

  // Fisher-Yates shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  return letters;
};

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [wordList, setWordList] = useState<SpellingWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [spelledIndex, setSpelledIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Player Profile
  const [currentPlayer, setCurrentPlayer] = useState<PlayerProfile | null>(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per game
  const [timerActive, setTimerActive] = useState(false);

  
  // Modal State
  const [legalModal, setLegalModal] = useState<LegalModalType>('NONE');

  // Custom Game Tracking
  const [isCustomGame, setIsCustomGame] = useState(false);
  
  // Score State
  const [score, setScore] = useState(0);
  const scoreRef = React.useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('spellbound_settings');
    return saved ? JSON.parse(saved) : { theme: 'light', font: 'sans' };
  });

  const currentWordData = wordList[currentWordIndex];
  const targetWord = currentWordData?.word.toUpperCase() || "";

  // Scrambled Letter State
  const [scrambled, setScrambled] = useState<ScrambledLetter[]>([]);

  useEffect(() => {
    if (targetWord) {
      setScrambled(generateScrambledLetters(targetWord));
    } else {
      setScrambled([]);
    }
  }, [targetWord]);

  const handleVictory = useCallback(() => {
    setTimerActive(false);
    setGameState(GameState.VICTORY);

    if (currentPlayer) {
      const savedProfiles = localStorage.getItem('spellbound_profiles');
      if (savedProfiles) {
        const profiles: PlayerProfile[] = JSON.parse(savedProfiles);
        const updatedProfiles = profiles.map(p => {
          if (p.name === currentPlayer.name) {
            const newScore = p.score + scoreRef.current;
            const newLevel = Math.floor(newScore / 100) + 1;
            
            // Add rewards based on level
            const possibleRewards = ['🌟', '🏆', '👑', '🚀', '🦄', '🦖', '🦁', '🎨', '🎸', '🎮'];
            const newRewards = [...p.rewards];
            
            // Give a reward for every level up to the number of possible rewards
            for (let i = p.level; i < newLevel; i++) {
              if (i - 1 < possibleRewards.length && !newRewards.includes(possibleRewards[i - 1])) {
                newRewards.push(possibleRewards[i - 1]);
              }
            }

            const updatedProfile = {
              ...p,
              score: newScore,
              level: newLevel,
              rewards: newRewards
            };
            setCurrentPlayer(updatedProfile);
            return updatedProfile;
          }
          return p;
        });
        localStorage.setItem('spellbound_profiles', JSON.stringify(updatedProfiles));
      }
    }
  }, [currentPlayer]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleVictory();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, handleVictory]);

  // Apply Theme & Font
  useEffect(() => {
    // Save settings
    localStorage.setItem('spellbound_settings', JSON.stringify(settings));

    // Apply Dark Mode
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply Font
    document.body.className = `bg-sky-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 selection:bg-yellow-200 font-${settings.font}`;
  }, [settings]);

  // Use browser native SpeechSynthesis
  const playWordAudio = useCallback((word: string) => {
    if (!word) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      (v.lang.startsWith('en') && v.name.includes('Female'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Effect to play custom victory message
  useEffect(() => {
    if (gameState === GameState.VICTORY && isCustomGame) {
      const msg = getCustomVictoryMessage();
      // Small delay to allow victory sound to start first
      setTimeout(() => {
        playWordAudio(msg);
      }, 500);
    }
  }, [gameState, isCustomGame, playWordAudio]);

  const getPointsPerWord = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 10;
      case Difficulty.MEDIUM: return 20;
      case Difficulty.HARD: return 30;
    }
  };

  const startGame = async () => {
    setGameState(GameState.LOADING);
    setLoading(true);
    setScore(0); // Reset score
    setIsCustomGame(false);
    setTimeLeft(60); // Reset timer

    try {
      const words = await generateWordList(difficulty, selectedLetter);
      setWordList(words);
      setCurrentWordIndex(0);
      setSpelledIndex(0);
      setGameState(GameState.PLAYING);
      if (settings.timerEnabled) {
        setTimerActive(true);
      }
      
      if (words.length > 0) {
        setTimeout(() => {
          playWordAudio(words[0].word);
        }, 800);
      }
    } catch (e) {
      console.error("Failed to start game", e);
      setGameState(GameState.MENU);
    } finally {
      setLoading(false);
    }
  };

  const startCustomGame = async () => {
    setGameState(GameState.LOADING);
    setLoading(true);
    setScore(0);
    setIsCustomGame(true);
    setTimeLeft(60); // Reset timer

    try {
      const words = generateCustomGameWords();
      
      if (words.length === 0) {
        alert("No instructor words found! Ask your teacher to add some.");
        setGameState(GameState.MENU);
        setLoading(false);
        return;
      }

      setWordList(words);
      setCurrentWordIndex(0);
      setSpelledIndex(0);
      setGameState(GameState.PLAYING);
      if (settings.timerEnabled) {
        setTimerActive(true);
      }
      
      if (words.length > 0) {
        setTimeout(() => {
          playWordAudio(words[0].word);
        }, 800);
      }
    } catch (e) {
      console.error("Failed to start custom game", e);
      setGameState(GameState.MENU);
    } finally {
      setLoading(false);
    }
  };

  const handleNextWord = useCallback(() => {
    if (currentWordIndex + 1 < wordList.length) {
      setCurrentWordIndex(prev => prev + 1);
      setSpelledIndex(0);
      setTimeout(() => {
        playWordAudio(wordList[currentWordIndex + 1].word);
      }, 1000);
    } else {
      handleVictory();
    }
  }, [currentWordIndex, wordList.length, playWordAudio, handleVictory]);

  const handleInput = useCallback((char: string, clickedIndex?: number) => {
    if (gameState !== GameState.PLAYING) return;
    
    const correctChar = targetWord[spelledIndex];

    if (char.toUpperCase() === correctChar) {
      // Correct Letter
      audioService.playSuccess();
      const nextIndex = spelledIndex + 1;
      setSpelledIndex(nextIndex);

      // Consume the scrambled letter
      setScrambled(prev => {
        const updated = [...prev];
        // If we know the exact index of the clicked button, use it!
        if (clickedIndex !== undefined && clickedIndex >= 0 && clickedIndex < updated.length) {
          updated[clickedIndex] = { ...updated[clickedIndex], used: true };
          return updated;
        }
        // Otherwise (e.g. keyboard press), find the first unused button with this letter
        const indexToUpdate = updated.findIndex(item => item.char === correctChar && !item.used);
        if (indexToUpdate !== -1) {
          updated[indexToUpdate] = { ...updated[indexToUpdate], used: true };
        }
        return updated;
      });

      if (nextIndex === targetWord.length) {
        // Word Completed
        const points = getPointsPerWord(difficulty);
        setScore(prev => prev + points);
        
        // Remove from custom list if playing Instructor Challenge
        if (isCustomGame) {
          const customWord = currentWordData as CustomWord;
          if (customWord && customWord.id) {
            deleteCustomWord(customWord.id);
          }
        }

        setTimeout(() => {
          audioService.playVictory();
          handleNextWord();
        }, 500);
      }
    } else {
      // Wrong Letter
      audioService.playError();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [gameState, targetWord, spelledIndex, difficulty, playWordAudio, isCustomGame, currentWordData, handleNextWord]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (/^[A-Z]$/.test(char)) {
        handleInput(char);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);


  // --- Render Views ---

  const renderContent = () => {
    if (gameState === GameState.PROFILE) {
      return (
        <ProfilePanel 
          onSelectProfile={(profile) => {
            setCurrentPlayer(profile);
            setGameState(GameState.MENU);
          }} 
          onBack={() => setGameState(GameState.MENU)} 
        />
      );
    }

    if (gameState === GameState.ADMIN) {
      return <AdminPanel onBack={() => setGameState(GameState.MENU)} />;
    }

    if (gameState === GameState.MENU) {
      const hasCustomWords = getCustomWords().length > 0;

      return (
        <div className="min-h-full flex flex-col items-center justify-center p-4 py-8">
          <LegalModal type={legalModal} onClose={() => setLegalModal('NONE')} />

          <div className="max-w-4xl w-full text-center space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-700 my-8 transition-colors">
            <div className="flex justify-end gap-2 absolute top-6 right-6">
               <button 
                onClick={() => setGameState(GameState.SETTINGS)}
                className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight animate-float mb-8">
              SpellBound <span className="text-yellow-500">Kids</span>
            </h1>

            {/* Player Profile Section */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8 inline-block border-2 border-indigo-100 dark:border-slate-700">
              {currentPlayer ? (
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Current Player</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{currentPlayer.name}</p>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Level {currentPlayer.level} • Score: {currentPlayer.score}</p>
                    <div className="flex gap-1 mt-1">
                      {currentPlayer.rewards.map((r, i) => <span key={i}>{r}</span>)}
                    </div>
                  </div>
                  <Button onClick={() => setGameState(GameState.PROFILE)} variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <p className="text-slate-600 dark:text-slate-300 font-medium">No player selected</p>
                  <Button onClick={() => setGameState(GameState.PROFILE)} variant="primary" size="sm">
                    Select Player
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              {/* Custom Words Section - Only shows if words exist */}
              {hasCustomWords && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 animate-pulse">
                  <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
                    🎓 Teacher's Challenge 🎓
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-300 mb-4">
                    Test your skills on words added by your instructor!
                  </p>
                  <Button onClick={startCustomGame} variant="selected" className="w-full sm:w-auto px-8">
                    Play Instructor Words
                  </Button>
                </div>
              )}

              {/* Difficulty Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">1. Select Level</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    onClick={() => setDifficulty(Difficulty.EASY)} 
                    variant={difficulty === Difficulty.EASY ? 'selected' : 'outline'}
                  >
                    Easy 🌟
                  </Button>
                  <Button 
                    onClick={() => setDifficulty(Difficulty.MEDIUM)} 
                    variant={difficulty === Difficulty.MEDIUM ? 'selected' : 'outline'}
                  >
                    Medium 🚀
                  </Button>
                  <Button 
                    onClick={() => setDifficulty(Difficulty.HARD)} 
                    variant={difficulty === Difficulty.HARD ? 'selected' : 'outline'}
                  >
                    Hard 🦁
                  </Button>
                </div>
              </div>

              {/* Alphabet Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">2. Select Letter</h3>
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                  <Button 
                    onClick={() => setSelectedLetter('ALL')}
                    variant={selectedLetter === 'ALL' ? 'selected' : 'outline'}
                    className="w-full sm:w-auto px-8"
                  >
                    All Letters
                  </Button>
                  <div className="w-full"></div>
                  {ALPHABET.map(letter => (
                    <Button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      variant={selectedLetter === letter ? 'selected' : 'outline'}
                      size="xl"
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button onClick={() => setGameState(GameState.ADMIN)} variant="secondary" className="w-full md:w-auto">
                  Instructor Panel 👨‍🏫
                </Button>
                <Button onClick={startGame} variant="primary" size="lg" className="w-full md:w-auto min-w-[200px]">
                  START GAME ▶
                </Button>
              </div>

              {/* Legal Footer */}
              <div className="pt-8 flex justify-center gap-6 text-sm text-slate-400 dark:text-slate-500 font-medium border-t border-slate-100 dark:border-slate-800">
                 <button onClick={() => window.open('https://spell-safely-kids.lovable.app', '_blank')} className="hover:text-indigo-500 transition-colors hover:underline">
                   Privacy Policy
                 </button>
                 <span>•</span>
                 <button onClick={() => setLegalModal('TERMS')} className="hover:text-indigo-500 transition-colors hover:underline">
                   Terms of Use
                 </button>
              </div>

            </div>
          </div>
        </div>
      );
    }

    if (gameState === GameState.SETTINGS) {
      return (
        <SettingsPanel 
          settings={settings} 
          onUpdate={setSettings} 
          onBack={() => setGameState(GameState.MENU)} 
        />
      );
    }

    if (gameState === GameState.LOADING) {
      return (
        <div className="min-h-full h-full flex flex-col items-center justify-center space-y-6 bg-sky-100 dark:bg-slate-900">
          <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <h2 className="text-3xl font-bold text-blue-600 animate-pulse">Preparing Words...</h2>
        </div>
      );
    }

    if (gameState === GameState.VICTORY) {
      return (
        <div className="min-h-full h-full flex flex-col items-center justify-center p-4 text-center bg-yellow-100 dark:bg-slate-900 transition-colors overflow-x-hidden">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-yellow-500 mb-8 drop-shadow-lg animate-bounce w-full break-words px-4">
            CONGRATULATIONS!
          </h1>
          <p className="text-2xl sm:text-3xl text-slate-700 dark:text-slate-200 mb-8 px-4">You are a Spelling Master! 🏆</p>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl mb-12 border-4 border-yellow-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-2">Final Score</p>
            <p className="text-6xl font-black text-indigo-600 dark:text-indigo-400">{score}</p>
            
            {currentPlayer && (
              <div className="mt-6 pt-6 border-t-2 border-slate-100 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-2">{currentPlayer.name}'s Total Score</p>
                <p className="text-3xl font-bold text-slate-700 dark:text-slate-200">{currentPlayer.score}</p>
                <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mt-2">Level {currentPlayer.level}</p>
                <div className="flex justify-center gap-2 mt-4 text-3xl">
                  {currentPlayer.rewards.map((r, i) => <span key={i} className="animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>{r}</span>)}
                </div>
              </div>
            )}
          </div>

          <Button onClick={() => setGameState(GameState.MENU)} size="lg" variant="secondary">
            Play Again
          </Button>
        </div>
      );
    }

    // PLAYING STATE
    return (
      <div className="min-h-full h-full flex flex-col max-w-5xl mx-auto p-4 justify-between">
        {/* Header */}
        <header className="flex justify-between items-center py-2 px-1 sm:py-4">
          <button 
            onClick={() => {
              setTimerActive(false);
              setGameState(GameState.MENU);
            }}
            className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-colors text-sm sm:text-base"
          >
            ← Quit
          </button>
          
          {/* Score & Game Info Display */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1.5 sm:gap-2">
            {settings.timerEnabled && (
              <div className={`text-xs sm:text-xl font-bold px-2 sm:px-6 py-1 sm:py-2 rounded-full shadow-sm border ${timeLeft <= 10 ? 'bg-red-100 border-red-300 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 dark:border-slate-700'}`}>
                Time: <span className={timeLeft <= 10 ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}>{timeLeft}s</span>
              </div>
            )}
            <div className="text-xs sm:text-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 sm:px-6 py-1 sm:py-2 rounded-full shadow-sm border dark:border-slate-700">
              Score: <span className="text-indigo-600 dark:text-indigo-400">{score}</span>
            </div>
            <div className="text-xs sm:text-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 sm:px-6 py-1 sm:py-2 rounded-full shadow-sm border dark:border-slate-700">
              {currentWordIndex + 1} / {wordList.length}
            </div>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="flex-1 flex flex-col items-center justify-center my-2 sm:my-4">
          
          {/* Helper/Hint Section */}
          <div className="flex flex-col items-center gap-2 mb-2 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 bg-white/60 dark:bg-slate-800/60 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all">
              <span className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-lg">
                Hint: {currentWordData?.hint}
              </span>
              <button 
                onClick={() => playWordAudio(targetWord)}
                className="p-1 sm:p-2 bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Listen again"
                title="Listen again"
              >
                <VolumeIcon className="w-5 h-5 sm:w-6 h-6" /> 
              </button>
            </div>
          </div>

          {/* The Word Grid */}
          <WordDisplay 
            targetWord={targetWord} 
            currentIndex={spelledIndex} 
            isShake={shake}
          />

        </main>

        {/* Scattered Letters Panel */}
        <footer className="pb-12 sm:pb-6 flex justify-center w-full">
          <ScrambledLetters 
            letters={scrambled}
            onLetterClick={handleInput}
            disabled={loading}
          />
        </footer>
      </div>
    );
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-sky-100 dark:bg-slate-900 transition-colors duration-300 font-${settings.font} bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed pb-40 lg:pb-0 box-border`}>
      {/* Scrollable primary view area */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto relative flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;