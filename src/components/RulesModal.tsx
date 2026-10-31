import React from 'react';
import { HelpCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrint: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, onOpenPrint }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ¿Cómo funciona "El Mensaje Secreto"?
              </h3>
              <p className="text-xs text-slate-500">Dinámica paso a paso para el profesor o guía</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 mb-6 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200/70">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">
                Prepara los 25 papelitos
              </strong>
              Usa el botón de <strong>"Imprimir Papelitos"</strong> arriba para imprimir y recortar
              los 25 mensajes doblados en una cajita o sobre misterioso.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50/70 rounded-2xl border border-blue-200/70">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">
                Cada niño pasa y gira la ruleta
              </strong>
              El niño puede escribir su nombre (opcional) y tocar el botón gigante de la calculadora.
              La ruleta girará con sonido de engranajes y la pantalla buscará un número.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/70">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">
                ¡Sin repetición garantizada!
              </strong>
              El sistema elimina automáticamente los números que ya salieron. La ruleta solo se
              detendrá en los números aún disponibles hasta completar los 25 niños.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-200/70">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">
                Entrega del Mensaje Secreto
              </strong>
              Al detenerse en pantalla, el niño verá su número en grande y tú le entregarás el
              papelito numerado correspondiente.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
              onOpenPrint();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver e Imprimir Papelitos</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            ¡Entendido, a jugar!
          </button>
        </div>
      </div>
    </div>
  );
};
