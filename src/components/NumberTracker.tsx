import React from 'react';
import { RotateCcw, Undo2, Award, CheckCircle2, CircleDashed } from 'lucide-react';
import { SpinResult, SecretMessage } from '../types/game';
import { soundEngine } from '../utils/audio';

interface NumberTrackerProps {
  drawnNumbers: number[];
  availableNumbers: number[];
  history: SpinResult[];
  messages: SecretMessage[];
  onUndoLast: () => void;
  onResetGame: () => void;
  onSelectNumberInfo: (num: number) => void;
}

export const NumberTracker: React.FC<NumberTrackerProps> = ({
  drawnNumbers,
  availableNumbers,
  history,
  onUndoLast,
  onResetGame,
  onSelectNumberInfo
}) => {
  const totalCount = 25;
  const revealedCount = drawnNumbers.length;
  const progressPercent = (revealedCount / totalCount) * 100;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 flex flex-col h-full">
      {/* Header & Status */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Control de Números (1 al 25)</span>
          </h2>
          <p className="text-xs text-slate-500">
            {revealedCount} entregados · {availableNumbers.length} restantes sin repetir
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (history.length > 0) {
                soundEngine.playKeyClick();
                onUndoLast();
              }
            }}
            disabled={history.length === 0}
            className="p-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1"
            title="Deshacer el último giro"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deshacer</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onResetGame();
            }}
            className="p-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1"
            title="Reiniciar todo el sorteo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
        <div
          className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Matrix 1-25 Grid */}
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Tablero de Números</span>
          <span className="text-slate-500 font-medium">Clic para ver detalles</span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {Array.from({ length: totalCount }, (_, i) => {
            const num = i + 1;
            const isDrawn = drawnNumbers.includes(num);
            const historyItem = history.find((h) => h.number === num);

            return (
              <button
                key={num}
                type="button"
                onClick={() => {
                  soundEngine.playKeyClick();
                  onSelectNumberInfo(num);
                }}
                className={`group relative h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isDrawn
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 line-through opacity-70 hover:opacity-100'
                    : 'bg-white hover:bg-amber-50 text-slate-800 font-bold border-2 border-amber-300 hover:border-amber-500 shadow-xs hover:shadow-md'
                }`}
              >
                <span className="font-tech text-base sm:text-lg leading-none">{num}</span>
                {isDrawn && (
                  <span className="text-[8px] font-semibold text-emerald-600 no-underline not-italic">
                    Turno {historyItem?.turnIndex}
                  </span>
                )}
                {!isDrawn && (
                  <span className="text-[8px] text-amber-600/80 font-medium">Listo</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sequential Turn History Feed */}
      <div className="flex-1 flex flex-col min-h-[160px]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Historial de Turnos</span>
          <span>{history.length} registrados</span>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <CircleDashed className="w-6 h-6 mb-1 text-slate-300 animate-spin" />
              <p className="text-xs font-medium">Aún no se ha realizado ningún giro</p>
              <p className="text-[11px] text-slate-400">Presiona el botón de la calculadora para comenzar</p>
            </div>
          ) : (
            [...history].reverse().map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  soundEngine.playKeyClick();
                  onSelectNumberInfo(item.number);
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold font-tech text-xs flex items-center justify-center shrink-0">
                    #{item.number}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">
                      {item.kidName || `Explorador Turno ${item.turnIndex}`}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">
                      {item.message.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Turno {item.turnIndex}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
