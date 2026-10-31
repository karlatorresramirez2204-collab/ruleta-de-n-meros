/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Printer, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { HeaderNav } from './components/HeaderNav';
import { RouletteCalculator } from './components/RouletteCalculator';
import { NumberTracker } from './components/NumberTracker';
import { ResultModal } from './components/ResultModal';
import { TeacherPrintModal } from './components/TeacherPrintModal';
import { RulesModal } from './components/RulesModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { NumberDetailModal } from './components/NumberDetailModal';
import { SecretMessage, SpinResult } from './types/game';
import { DEFAULT_SECRET_MESSAGES } from './utils/defaultMessages';
import { soundEngine } from './utils/audio';

const STORAGE_KEY_DRAWN = 'secret_msg_drawn_numbers_v1';
const STORAGE_KEY_HISTORY = 'secret_msg_history_v1';
const STORAGE_KEY_MESSAGES = 'secret_msg_custom_messages_v1';

export default function App() {
  // Load initial state from localStorage or defaults
  const [messages, setMessages] = useState<SecretMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SECRET_MESSAGES;
  });

  const [drawnNumbers, setDrawnNumbers] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAWN);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [history, setHistory] = useState<SpinResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Modals & UI state
  const [activeResult, setActiveResult] = useState<SpinResult | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [inspectedNumber, setInspectedNumber] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRAWN, JSON.stringify(drawnNumbers));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch {
      // storage quota or private browsing
    }
  }, [drawnNumbers, history, messages]);

  // Compute strictly available numbers from 1 to 25
  const availableNumbers = useMemo(() => {
    const all = Array.from({ length: 25 }, (_, i) => i + 1);
    return all.filter((n) => !drawnNumbers.includes(n));
  }, [drawnNumbers]);

  // Handle number drawn from roulette
  const handleNumberDrawn = (result: SpinResult) => {
    setDrawnNumbers((prev) => [...prev, result.number]);
    setHistory((prev) => [...prev, result]);
    setActiveResult(result);
  };

  // Undo last draw in case a kid pressed mistakenly
  const handleUndoLast = () => {
    if (history.length === 0) return;
    const lastItem = history[history.length - 1];
    setDrawnNumbers((prev) => prev.filter((n) => n !== lastItem.number));
    setHistory((prev) => prev.slice(0, -1));
  };

  // Full reset for next classroom session
  const handleResetGame = () => {
    setDrawnNumbers([]);
    setHistory([]);
    setActiveResult(null);
  };

  // Update specific secret message
  const handleUpdateMessage = (index: number, updated: SecretMessage) => {
    setMessages((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

  const handleUpdateSingleMessage = (updated: SecretMessage) => {
    setMessages((prev) =>
      prev.map((m) => (m.number === updated.number ? updated : m))
    );
  };

  // Reset messages array to a new preset
  const handleResetMessages = (newMessages: SecretMessage[]) => {
    setMessages(newMessages);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    soundEngine.playKeyClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) soundEngine.playKeyClick();
  };

  const inspectedMessage = messages.find((m) => m.number === inspectedNumber);
  const inspectedHistoryItem = history.find((h) => h.number === inspectedNumber);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-amber-200 text-slate-800">
      {/* Navigation Header */}
      <HeaderNav
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        remainingCount={availableNumbers.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Activity Banner */}
        <div className="mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 sm:p-5 text-slate-950 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 font-black font-tech text-xl flex items-center justify-center shrink-0 shadow-xs">
              ★
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 leading-snug">
                El Mensaje Secreto · Dinámica de la Calculadora Mágica
              </h1>
              <p className="text-xs sm:text-sm text-amber-950/90 font-medium">
                Cada niño presiona el botón una vez para girar la ruleta y obtener un número del 1 al 25 sin repeticiones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                soundEngine.playKeyClick();
                setIsRulesOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Instrucciones</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeyClick();
                setIsPrintOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-amber-400 hover:text-amber-300 text-xs font-black shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Papelitos (1-25)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Calculadora Ruleta (7 columns on large desktop) */}
          <div className="lg:col-span-7 flex justify-center">
            <RouletteCalculator
              availableNumbers={availableNumbers}
              drawnNumbers={drawnNumbers}
              messages={messages}
              onNumberDrawn={handleNumberDrawn}
              onResetGame={() => setIsResetConfirmOpen(true)}
              historyCount={history.length}
            />
          </div>

          {/* Right Column: Number Control Matrix & History (5 columns) */}
          <div className="lg:col-span-5">
            <NumberTracker
              drawnNumbers={drawnNumbers}
              availableNumbers={availableNumbers}
              history={history}
              messages={messages}
              onUndoLast={handleUndoLast}
              onResetGame={() => setIsResetConfirmOpen(true)}
              onSelectNumberInfo={(num) => setInspectedNumber(num)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto py-5 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Juego Infantil: <strong>El Mensaje Secreto</strong> · 25 Números sin repetición</span>
          <span className="text-slate-400">
            Diseñado para clases, dinámicas de campamento, talleres y convivencias infantiles
          </span>
        </div>
      </footer>

      {/* Modals */}
      <ResultModal
        result={activeResult}
        isOpen={!!activeResult}
        onClose={() => setActiveResult(null)}
        remainingCount={availableNumbers.length}
      />

      <TeacherPrintModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        messages={messages}
        onUpdateMessage={handleUpdateMessage}
        onResetMessages={handleResetMessages}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        onOpenPrint={() => setIsPrintOpen(true)}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetGame}
        drawnCount={drawnNumbers.length}
      />

      <NumberDetailModal
        number={inspectedNumber}
        isOpen={inspectedNumber !== null}
        onClose={() => setInspectedNumber(null)}
        message={inspectedMessage}
        historyItem={inspectedHistoryItem}
        onUpdateMessage={handleUpdateSingleMessage}
      />
    </div>
  );
}
