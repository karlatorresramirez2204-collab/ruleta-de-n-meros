import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  drawnCount: number;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  drawnCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          ¿Reiniciar el juego?
        </h3>
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Ya se han sorteado <strong>{drawnCount} de 25 números</strong>. Si reinicias, todos los
          números volverán a estar disponibles para un nuevo grupo de niños.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            type="button"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              soundEngine.playResetSound();
              onConfirm();
              onClose();
            }}
            type="button"
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sí, Reiniciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
