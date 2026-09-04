import React from 'react';
import Button from './Button';

export type LegalModalType = 'NONE' | 'ABOUT' | 'TERMS' | 'PRIVACY';

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (type === 'NONE') return null;

  const renderContent = () => {
    switch (type) {
      case 'ABOUT':
        return (
          <>
            <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">About SpellBound Kids</h3>
            <p className="mb-4">
              SpellBound Kids is an educational interactive spelling game designed to help children improve their vocabulary and spelling skills through audio-visual cues and gamified feedback.
            </p>
            <p className="mb-4">
              <strong>Features:</strong><br/>
              • Voice pronunciation<br/>
              • Instant feedback<br/>
              • Instructor/Parent mode for custom words<br/>
              • Fully offline capability
            </p>
            <p className="text-sm text-slate-500">Version 1.0.0</p>
          </>
        );
      case 'PRIVACY':
        return (
          <>
            <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Privacy Policy</h3>
            <p className="mb-4 font-bold">We take your privacy seriously.</p>
            <p className="mb-4">
              <strong>1. Data Collection:</strong> SpellBound Kids does <u>not</u> collect, transmit, or store any personal information, location data, or usage analytics on external servers.
            </p>
            <p className="mb-4">
              <strong>2. Local Storage:</strong> All game progress, settings, and custom words are stored locally on your device's internal memory.
            </p>
            <p className="mb-4">
              <strong>3. Third Parties:</strong> This app contains no third-party advertisements and no analytics SDKs.
            </p>
            <p className="mb-4">
              <strong>4. Microphone Usage:</strong> This app does not record audio or access the microphone. It uses the device's text-to-speech engine for audio output only.
            </p>
            <p>
              <strong>5. Contact:</strong> For support, please contact the developer via the App Store support link.
            </p>
          </>
        );
      case 'TERMS':
        return (
          <>
            <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Terms of Use</h3>
            <p className="mb-4">
              By using SpellBound Kids, you agree to the following terms:
            </p>
            <p className="mb-2">
              1. <strong>Usage:</strong> This app is intended for educational and entertainment purposes.
            </p>
            <p className="mb-2">
              2. <strong>Content:</strong> The default word lists are provided "as is". Custom words added by instructors/parents are stored locally.
            </p>
            <p className="mb-2">
              3. <strong>Disclaimer:</strong> The developers are not liable for any data loss resulting from device issues or uninstalling the application.
            </p>
            <p className="mb-2">
              4. <strong>EULA:</strong> This app is subject to the standard Apple Media Services Terms and Conditions (EULA).
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl border-4 border-slate-100 dark:border-slate-700 animate-float relative flex flex-col max-h-[70vh]">
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
           <div className="text-slate-700 dark:text-slate-300">
             {renderContent()}
           </div>
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-3xl">
           <Button onClick={onClose} variant="secondary" className="w-full">
             Close
           </Button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;