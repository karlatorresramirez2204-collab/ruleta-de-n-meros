import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Eye, EyeOff, PartyPopper } from 'lucide-react';
import { SpinResult } from '../types/game';
import { soundEngine } from '../utils/audio';

interface ResultModalProps {
  result: SpinResult | null;
  isOpen: boolean;
  onClose: () => void;
  remainingCount: number;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  isOpen,
  onClose,
  remainingCount
}) => {
  const [showSecretText, setShowSecretText] = useState(false);

  useEffect(() => {
    if (isOpen && result) {
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6']
      });

      // Sound fanfare
      soundEngine.playFanfare();
      setShowSecretText(false);
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-white to-amber-50/50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center overflow-hidden">
        {/* Decorative corner ribbons */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-300 rounded-full blur-2xl opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-300 rounded-full blur-2xl opacity-40" />

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>¡Mensaje Secreto Descubierto!</span>
          <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
        </div>

        {/* Kid Name */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">
          {result.kidName ? `¡Felicitaciones, ${result.kidName}!` : '¡Tu turno ha terminado!'}
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          La ruleta mágica se ha detenido y ha elegido tu número
        </p>

        {/* Giant Number Badge (Stylized like high-tech secret token) */}
        <div className="my-6 relative inline-block">
          <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-1.5 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full rounded-[22px] bg-slate-900 flex flex-col items-center justify-center text-white border-2 border-amber-300/40">
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                NÚMERO
              </span>
              <span className="text-6xl sm:text-7xl font-black font-tech text-amber-300 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {result.number}
              </span>
            </div>
          </div>
        </div>

        {/* Teacher instruction for child */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-5 text-left flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-sm">
            📜
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="block text-slate-900 font-bold mb-0.5">
              Instrucción para el niño o niña:
            </strong>
            Ve con el maestro o guía y pídele el papelito con el{' '}
            <strong className="text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
              Mensaje Secreto #{result.number}
            </strong>
            . ¡Guárdalo como un tesoro o léelo en voz alta!
          </div>
        </div>

        {/* Teacher preview spoiler toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowSecretText(!showSecretText)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 px-3 rounded-lg hover:bg-slate-100"
          >
            {showSecretText ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ocultar contenido del mensaje secreto</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Ver qué dice el mensaje secreto #{result.number} (Profesor)</span>
              </>
            )}
          </button>

          {showSecretText && (
            <div className="mt-2.5 p-3.5 bg-white rounded-xl border border-dashed border-amber-400 text-left text-xs sm:text-sm animate-in slide-in-from-top-1">
              <p className="font-bold text-amber-900 mb-1">{result.message.title}</p>
              <p className="text-slate-700 italic">"{result.message.text}"</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={() => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
              });
              soundEngine.playFanfare();
            }}
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            🎉 ¡Más Confeti!
          </button>

          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            type="button"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-transform active:scale-95"
          >
            <span>{remainingCount > 0 ? '¡Siguiente Niño!' : 'Ver Resultados Finales'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 text-[11px] text-slate-400">
          Quedan {remainingCount} números disponibles por sortear
        </div>
      </div>
    </div>
  );
};
