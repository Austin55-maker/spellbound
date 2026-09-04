import React, { useState, useEffect } from 'react';
import Button from './Button';
import { PlayerProfile } from '../types';

interface ProfilePanelProps {
  onSelectProfile: (profile: PlayerProfile) => void;
  onBack: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onSelectProfile, onBack }) => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    const savedProfiles = localStorage.getItem('spellbound_profiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  const saveProfiles = (newProfiles: PlayerProfile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('spellbound_profiles', JSON.stringify(newProfiles));
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newProfile: PlayerProfile = {
      name: newProfileName.trim(),
      score: 0,
      level: 1,
      rewards: []
    };
    saveProfiles([...profiles, newProfile]);
    setNewProfileName('');
    onSelectProfile(newProfile);
  };

  const handleDeleteProfile = (name: string) => {
    saveProfiles(profiles.filter(p => p.name !== name));
  };

  return (
    <div className="min-h-full h-full flex flex-col items-center justify-center p-4 bg-sky-100 dark:bg-slate-900 transition-colors">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Select Player</h2>
          <button onClick={onBack} className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold">
            ← Back
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {profiles.map(profile => (
            <div key={profile.name} className="flex items-center justify-between p-4 border-2 border-indigo-100 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
              <div className="flex-1 cursor-pointer" onClick={() => onSelectProfile(profile)}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Level {profile.level} • Score: {profile.score}</p>
                <div className="flex gap-1 mt-1">
                  {profile.rewards.map((reward, i) => <span key={i} className="text-lg">{reward}</span>)}
                </div>
              </div>
              <button 
                onClick={() => handleDeleteProfile(profile.name)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
          
          {profiles.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">No players found. Create one below!</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Enter kid's name..."
            className="flex-1 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-indigo-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
          />
          <Button onClick={handleCreateProfile} variant="primary">
            Add Player
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
