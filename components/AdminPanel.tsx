import React, { useState, useEffect } from 'react';
import { Difficulty, CustomWord } from '../types';
import { getCustomWords, addCustomWord, deleteCustomWord, getCustomVictoryMessage, setCustomVictoryMessage } from '../services/wordService';
import Button from './Button';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [words, setWords] = useState<CustomWord[]>([]);
  
  // Form State
  const [newWord, setNewWord] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>(Difficulty.EASY);

  // Victory Message State
  const [victoryMessage, setVictoryMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    loadWords();
    setVictoryMessage(getCustomVictoryMessage());
  }, []);

  const loadWords = () => {
    setWords(getCustomWords());
  };

  const handleSaveMessage = () => {
    setCustomVictoryMessage(victoryMessage);
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newHint) return;

    if (words.length >= 10) {
      alert("You can only set up to 10 words at a time. Please delete some completed tasks/words before adding new ones.");
      return;
    }

    addCustomWord(newWord, newHint, newDifficulty);
    setNewWord('');
    setNewHint('');
    loadWords();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this word?')) {
      deleteCustomWord(id);
      loadWords();
    }
  };

  return (
    <div className="min-h-full h-full p-4 md:p-8 bg-sky-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">Instructor Panel</h2>
          <Button onClick={onBack} variant="outline" size="sm">
            ← Back to Menu
          </Button>
        </div>

        {/* Victory Message Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
           <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">📢 Student Encouragement Message</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
             This message will be spoken to the student when they finish all assigned words.
           </p>
           <div className="flex gap-4">
             <input 
               type="text" 
               value={victoryMessage}
               onChange={(e) => setVictoryMessage(e.target.value)}
               className="flex-1 p-3 border rounded-xl dark:bg-slate-900 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
               placeholder="e.g. Well done! You are amazing!"
             />
             <Button onClick={handleSaveMessage} variant="secondary" size="md">
               Save Message
             </Button>
           </div>
           {saveStatus && <p className="text-green-500 font-bold mt-2">{saveStatus}</p>}
        </div>

        {/* Add New Word Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Add New Word</h3>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${words.length >= 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {words.length}/10 Words
            </span>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Word (e.g., ZEBRA)"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value.toUpperCase())}
              className="p-3 border rounded-xl dark:bg-slate-900 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              disabled={words.length >= 10}
            />
            <input
              type="text"
              placeholder="Hint (e.g., Striped horse)"
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              className="p-3 border rounded-xl dark:bg-slate-900 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              disabled={words.length >= 10}
            />
            <select
              value={newDifficulty}
              onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
              className="p-3 border rounded-xl dark:bg-slate-900 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              disabled={words.length >= 10}
            >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={words.length >= 10}
              className={words.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Add Word
            </Button>
          </form>
          {words.length >= 10 && (
            <p className="text-red-500 text-sm mt-2 font-medium">
              Maximum word limit reached. Students must complete words or you must delete them to add more.
            </p>
          )}
        </div>

        {/* Word List */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Custom Words Database</h3>
          {words.length === 0 ? (
            <p className="text-slate-500 italic text-center py-8">No custom words added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 border-b dark:border-slate-600">
                    <th className="pb-2">Word</th>
                    <th className="pb-2">Hint</th>
                    <th className="pb-2">Level</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {words.map((w) => (
                    <tr key={w.id} className="border-b last:border-0 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="py-3 font-bold">{w.word}</td>
                      <td className="py-3">{w.hint}</td>
                      <td className="py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          w.difficulty === Difficulty.EASY ? 'bg-green-100 text-green-700' :
                          w.difficulty === Difficulty.MEDIUM ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {w.difficulty}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => handleDelete(w.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;