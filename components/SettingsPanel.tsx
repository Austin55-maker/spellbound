import React, { useState } from 'react';
import Button from './Button';
import LegalModal, { LegalModalType } from './LegalModal';
import { AppSettings, FontFamily, ThemeMode } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  onBack: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onBack }) => {
  const [activeModal, setActiveModal] = useState<LegalModalType>('NONE');
  const [isErasing, setIsErasing] = useState(false);
  
  const updateTheme = (theme: ThemeMode) => {
    onUpdate({ ...settings, theme });
  };

  const updateFont = (font: FontFamily) => {
    onUpdate({ ...settings, font });
  };

  const toggleTimer = () => {
    onUpdate({ ...settings, timerEnabled: !settings.timerEnabled });
  };

  const handleEraseData = () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete ALL custom words, scores, and settings. This cannot be undone. Are you sure?")) {
      setIsErasing(true);
      setTimeout(() => {
        localStorage.clear();
        window.location.reload(); 
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-slate-100 dark:border-slate-700 animate-float my-auto relative overflow-hidden">
        
        {/* Erasing Overlay Animation */}
        {isErasing && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <div className="text-8xl animate-bounce mb-4">🧹</div>
            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 animate-pulse">Scrubbing Data...</h3>
            <p className="text-slate-500 mt-2 text-sm font-bold">Restarting app shortly</p>
          </div>
        )}

        {/* Render Shared Legal/About Modal */}
        <LegalModal type={activeModal} onClose={() => setActiveModal('NONE')} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">Settings</h2>
          <button onClick={onBack} disabled={isErasing} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Appearance</h3>
            <div className="flex gap-4">
              <button
                onClick={() => updateTheme('light')}
                disabled={isErasing}
                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                  settings.theme === 'light' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md ring-2 ring-indigo-200' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">☀️</span>
                <span className="font-bold text-sm">Light</span>
              </button>
              <button
                onClick={() => updateTheme('dark')}
                disabled={isErasing}
                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                  settings.theme === 'dark' 
                    ? 'border-indigo-500 bg-slate-900 text-indigo-400 shadow-md ring-2 ring-indigo-900' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">🌙</span>
                <span className="font-bold text-sm">Dark</span>
              </button>
            </div>
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lettering Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {['sans', 'serif', 'mono', 'comic'].map((f) => (
                 <button
                 key={f}
                 onClick={() => updateFont(f as FontFamily)}
                 disabled={isErasing}
                 className={`p-2 rounded-xl border-2 capitalize transition-all text-sm font-bold font-${f} ${
                   settings.font === f 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                 }`}
               >
                 {f === 'comic' ? 'Fun' : f}
               </button>
              ))}
            </div>
          </div>

          {/* Gameplay Settings */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gameplay</h3>
            <button
              onClick={toggleTimer}
              disabled={isErasing}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 font-bold text-sm flex justify-between items-center transition-all ${
                settings.timerEnabled
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <span>60-Second Timer</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.timerEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.timerEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* Information & Legal */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">About & Legal</h3>
             <div className="flex flex-col gap-2">
                <button disabled={isErasing} onClick={() => setActiveModal('ABOUT')} className="text-left px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 font-medium text-sm flex justify-between items-center">
                  <span>ℹ️ About SpellBound Kids</span>
                  <span>→</span>
                </button>
                <button disabled={isErasing} onClick={() => window.open('https://spell-safely-kids.lovable.app', '_blank')} className="text-left px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 font-medium text-sm flex justify-between items-center">
                  <span>🔒 Privacy Policy</span>
                  <span>→</span>
                </button>
                <button disabled={isErasing} onClick={() => setActiveModal('TERMS')} className="text-left px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 font-medium text-sm flex justify-between items-center">
                  <span>📜 Terms of Use</span>
                  <span>→</span>
                </button>
             </div>
          </div>

          {/* Data Management */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data Management</h3>
            <button 
              onClick={handleEraseData}
              disabled={isErasing}
              className="w-full text-left px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm flex justify-between items-center transition-colors disabled:opacity-50"
            >
              <span>🗑️ Erase All App Data</span>
              <span>⚠️</span>
            </button>
          </div>

          <div className="pt-2">
            <Button onClick={onBack} variant="primary" className="w-full" disabled={isErasing}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;