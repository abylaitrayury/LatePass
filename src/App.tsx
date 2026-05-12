/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clipboard, 
  Check, 
  RefreshCcw, 
  Moon, 
  Sun, 
  School, 
  User, 
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { SITUATIONS } from './constants';
import { Situation, ExcuseResponse } from './types';
import { generateExcuses } from './services/geminiService';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [teacherName, setTeacherName] = useState('');
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [excuses, setExcuses] = useState<ExcuseResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleGenerate = async () => {
    if (!selectedSituation) return;
    
    setIsLoading(true);
    setExcuses(null);
    try {
      const result = await generateExcuses(
        selectedSituation.label,
        teacherName,
        className
      );
      setExcuses(result);
    } catch (error) {
      console.error(error);
      alert('Failed to generate excuses. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const reset = () => {
    setExcuses(null);
    setSelectedSituation(null);
    setTeacherName('');
    setClassName('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <nav className="h-16 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none">
            <Zap size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LatePass</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            id="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {!excuses && !isLoading && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid lg:grid-cols-[1fr_300px] gap-8"
            >
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Generate your excuse</h2>
                  <p className="text-slate-500 dark:text-slate-400">Fill in the details and choose a situation to get started.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Instructor Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        id="teacher-name"
                        type="text"
                        placeholder="e.g. Dr. Henderson"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Class / Subject</label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        id="class-name"
                        type="text"
                        placeholder="e.g. Advanced Calculus"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Choose Situation</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SITUATIONS.map((sit) => (
                      <button
                        key={sit.id}
                        id={`situation-${sit.id}`}
                        onClick={() => setSelectedSituation(sit)}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all border ${
                          selectedSituation?.id === sit.id 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' 
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xl">{sit.emoji}</span>
                        <span className="text-sm">{sit.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <motion.button
                    id="generate-button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={!selectedSituation}
                    className="flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50"
                  >
                    <Sparkles size={20} />
                    Generate Excuses
                  </motion.button>
                </div>
              </div>

              {/* Sidebar Info */}
              <aside className="hidden lg:flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tips for Students</h4>
                  <ul className="space-y-3 text-xs text-slate-500 leading-relaxed italic">
                    <li>• Choose "Formal" for emails to ensure you sound professional.</li>
                    <li>• Use "Convincing" for high-stakes classes where details matter.</li>
                    <li>• Always check the believability score before sending!</li>
                  </ul>
                </div>
                <div className="p-6 bg-indigo-600 rounded-2xl text-white space-y-2">
                  <h4 className="font-bold">Need more help?</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed">Upgrade your student status with better attendance, or just keep using LatePass. We won't judge.</p>
                </div>
              </aside>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-2 border-slate-200 dark:border-slate-800 rounded-full animate-spin border-t-indigo-600"></div>
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
              </div>
              <p className="font-bold text-slate-400 animate-pulse">Calculating optimal excuses...</p>
            </motion.div>
          )}

          {excuses && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid lg:grid-cols-[1fr_320px] gap-8"
            >
              <div className="space-y-6">
                <ExcuseCard 
                  id="formal"
                  type="Formal Excuse"
                  tagStyle="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  content={excuses.formal} 
                  isCopied={copiedId === 'formal'}
                  onCopy={() => copyToClipboard(excuses.formal, 'formal')}
                />
                <ExcuseCard 
                  id="casual"
                  type="Casual Excuse"
                  tagStyle="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  content={excuses.casual} 
                  isCopied={copiedId === 'casual'}
                  onCopy={() => copyToClipboard(excuses.casual, 'casual')}
                />
                <ExcuseCard 
                  id="convincing"
                  type='"Convincing" Excuse'
                  tagStyle="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  content={excuses.convincing} 
                  isCopied={copiedId === 'convincing'}
                  onCopy={() => copyToClipboard(excuses.convincing, 'convincing')}
                />
                
                <div className="flex justify-center pt-4">
                  <button
                    id="generate-another"
                    onClick={reset}
                    className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
                  >
                    <RefreshCcw size={18} />
                    Generate Another Excuse
                  </button>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="80" cy="80" r="70" 
                        stroke="currentColor" strokeWidth="6" 
                        fill="none" 
                        className="text-slate-100 dark:text-slate-800"
                      />
                      <motion.circle 
                        cx="80" cy="80" r="70" 
                        stroke="currentColor" strokeWidth="6" 
                        strokeLinecap="round"
                        fill="none" 
                        strokeDasharray={440}
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (440 * excuses.believability) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-indigo-600"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="text-3xl font-black text-slate-800 dark:text-white">{excuses.believability}%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Believability Score</h3>
                  <p className="text-xs text-slate-400 mt-2">Calculated by AI based on social engineering heuristics.</p>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed italic">
                    "Use LatePass responsibly. High believability scores don't guarantee zero detentions!"
                  </p>
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center py-10 text-slate-400 text-xs tracking-wide space-y-2">
        <p>© {new Date().getFullYear()} LatePass AI — Student-to-Teacher Communications</p>
        <div className="flex items-center justify-center gap-1 opacity-50">
          <AlertCircle size={10} />
          <span>Use only in case of academic emergencies.</span>
        </div>
      </footer>
    </div>
  );
}

function ExcuseCard({ 
  id,
  type,
  tagStyle,
  content, 
  isCopied, 
  onCopy 
}: { 
  id: string;
  type: string;
  tagStyle: string;
  content: string; 
  isCopied: boolean; 
  onCopy: () => void 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagStyle}`}>
          {type}
        </span>
        <button
          id={`copy-${id}`}
          onClick={onCopy}
          className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
        >
          {isCopied ? <Check size={18} className="text-green-500" /> : <Clipboard size={18} />}
        </button>
      </div>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1">
        "{content}"
      </p>
    </motion.div>
  );
}
