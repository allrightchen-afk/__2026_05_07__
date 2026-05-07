/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 計時器組件
 * @param title 組組名稱
 * @param accentColor 主題顏色
 */
function TimerCard({ title, accentColor, icon: Icon }: { title: string; accentColor: string; icon: any }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 min-w-[320px] bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center"
    >
      <div className={`mb-6 p-4 rounded-2xl ${accentColor === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
        <Icon size={32} />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">{title}</h2>
      
      <div className="relative mb-12">
        <div className={`text-7xl md:text-8xl font-black font-mono tracking-tighter tabular-nums ${accentColor === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'}`}>
          {formatTime(seconds)}
        </div>
        {isActive && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`absolute -top-4 -right-4 w-4 h-4 rounded-full ${accentColor === 'indigo' ? 'bg-indigo-400' : 'bg-emerald-400'}`}
          />
        )}
      </div>

      <div className="flex gap-4 w-full">
        {!isActive ? (
          <button
            onClick={() => setIsActive(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-opacity-20 ${
              accentColor === 'indigo' 
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
            }`}
          >
            <Play size={20} fill="currentColor" /> 開始計時
          </button>
        ) : (
          <button
            onClick={() => setIsActive(false)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all active:scale-95"
          >
            <Pause size={20} fill="currentColor" /> 暫停
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="p-4 rounded-2xl font-bold bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 border border-slate-100"
          title="重設"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-slate-500 text-sm font-semibold mb-6 shadow-sm">
          <Trophy size={16} className="text-amber-500" />
          <span>班級競賽官方計時系統</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          雙軌<span className="text-indigo-600">同步</span>計時器
        </h1>
        <p className="mt-4 text-slate-500 font-medium">兩個獨立跑道，精準掌控每一秒</p>
      </header>

      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 items-stretch">
        <TimerCard 
          title="甲班 (Team Alpha)" 
          accentColor="indigo" 
          icon={Users}
        />
        
        <div className="hidden md:flex items-center">
          <div className="h-24 w-px bg-slate-200"></div>
        </div>

        <TimerCard 
          title="乙班 (Team Beta)" 
          accentColor="emerald" 
          icon={Users}
        />
      </div>

      <footer className="mt-16 text-slate-400 text-xs flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 uppercase tracking-widest font-bold">
          <span>Precision</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Reliability</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Speed</span>
        </div>
        <p className="mt-2 opacity-60">© 2026 Competitive Timing Systems INC.</p>
      </footer>
    </div>
  );
}
