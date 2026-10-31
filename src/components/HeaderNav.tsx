import React from 'react';
import { Sparkles, Printer, HelpCircle, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderNavProps {
  onOpenRules: () => void;
  onOpenPrint: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  remainingCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenRules,
  onOpenPrint,
  isFullscreen,
  onToggleFullscreen,
  isMuted,
  onToggleSound,
  remainingCount
}) => {
  return (
    <header className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black font-tech text-base shadow-xs">
            25
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 whitespace-nowrap">
            El Mensaje Secreto
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onOpenRules();
            }}
            className="hover:text-amber-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>¿Cómo Jugar?</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onOpenPrint();
            }}
            className="hover:text-amber-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-amber-500" />
            <span>Papelitos Imprimibles</span>
          </button>

          <span className="text-slate-400 font-normal select-none">·</span>

          <span className="text-xs font-mono font-medium text-slate-500 whitespace-nowrap">
            Disponibles: <strong className="text-slate-900">{remainingCount}</strong> de 25
          </span>

          <button
            onClick={onToggleSound}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onOpenPrint();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-amber-100/80 hover:bg-amber-200/80 rounded-xl transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 text-amber-700" />
            <span>Imprimir Papelitos</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Modo pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
