import React, { useState } from 'react';
import { Printer, X, Edit3, Check, RefreshCw, Sparkles, BookOpen, Heart, HelpCircle, Lightbulb } from 'lucide-react';
import { SecretMessage, PresetCategory } from '../types/game';
import { DEFAULT_SECRET_MESSAGES } from '../utils/defaultMessages';
import { soundEngine } from '../utils/audio';

interface TeacherPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: SecretMessage[];
  onUpdateMessage: (index: number, updated: SecretMessage) => void;
  onResetMessages: (newMessages: SecretMessage[]) => void;
}

export const TeacherPrintModal: React.FC<TeacherPrintModalProps> = ({
  isOpen,
  onClose,
  messages,
  onUpdateMessage,
  onResetMessages
}) => {
  const [editingNumber, setEditingNumber] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (msg: SecretMessage) => {
    soundEngine.playKeyClick();
    setEditingNumber(msg.number);
    setEditTitle(msg.title);
    setEditText(msg.text);
  };

  const handleSaveEdit = (number: number) => {
    soundEngine.playKeyClick();
    const existing = messages.find((m) => m.number === number);
    if (existing) {
      onUpdateMessage(number - 1, {
        ...existing,
        title: editTitle.trim() || `Mensaje Secreto #${number}`,
        text: editText.trim() || '¡Eres un gran explorador!'
      });
    }
    setEditingNumber(null);
  };

  const handleApplyPreset = (preset: PresetCategory) => {
    soundEngine.playKeyClick();
    // Helper to generate themed message presets
    const newMessages: SecretMessage[] = Array.from({ length: 25 }, (_, i) => {
      const num = i + 1;
      if (preset === 'valores') {
        return {
          number: num,
          title: `Virtud Secreta #${num}`,
          text: `Mensaje #${num}: Tu amabilidad, honestidad y esfuerzo hacen de este mundo un lugar mejor. ¡Sigue brillando siempre!`,
          category: 'positivo'
        };
      } else if (preset === 'retos') {
        return {
          number: num,
          title: `Misión Divertida #${num}`,
          text: `Reto #${num}: Comparte un cumplido sincero con tu compañero y haz un saludo secreto inventado por ti.`,
          category: 'reto'
        };
      } else if (preset === 'adivinanzas') {
        return {
          number: num,
          title: `Acertijo Escolar #${num}`,
          text: `Adivinanza #${num}: Tengo hojas y letras pero no soy un árbol. ¿Quién soy? (¡El libro!).`,
          category: 'adivinanza'
        };
      } else if (preset === 'curiosidades') {
        return {
          number: num,
          title: `Dato Asombroso #${num}`,
          text: `Curiosidad #${num}: ¿Sabías que el corazón de una ballena azul es tan grande como un auto pequeño?`,
          category: 'curiosidad'
        };
      }
      return DEFAULT_SECRET_MESSAGES[i];
    });

    onResetMessages(newMessages);
  };

  const handlePrint = () => {
    soundEngine.playKeyClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Papelitos de Mensajes Secretos (1 al 25)
              </h2>
              <p className="text-xs text-slate-300">
                Imprime y recorta los 25 papelitos para entregárselos a los niños cuando giren la ruleta
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Presets (no-print) */}
        <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3 no-print shrink-0">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-slate-600">Plantillas temáticas:</span>
            <button
              onClick={() => handleApplyPreset('mixto')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 font-medium rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Mixto Original</span>
            </button>
            <button
              onClick={() => handleApplyPreset('valores')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 font-medium rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
            >
              <Heart className="w-3 h-3 text-rose-500" />
              <span>Valores y Autoestima</span>
            </button>
            <button
              onClick={() => handleApplyPreset('retos')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 font-medium rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
            >
              <Lightbulb className="w-3 h-3 text-emerald-500" />
              <span>Retos Divertidos</span>
            </button>
            <button
              onClick={() => handleApplyPreset('adivinanzas')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 font-medium rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-purple-500" />
              <span>Adivinanzas</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApplyPreset('mixto')}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-white text-xs flex items-center gap-1"
              title="Restablecer mensajes por defecto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow transition-transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Papelitos Ahora</span>
            </button>
          </div>
        </div>

        {/* Slips Content (Printable Grid) */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 no-print flex items-center justify-between">
            <p>
              💡 <strong>Tip para el profesor:</strong> Puedes hacer clic en el lápiz de cualquier
              tarjeta para personalizar su texto antes de imprimir. Al recortarlos por la línea
              punteada, quedarán listos para doblar y entregar.
            </p>
          </div>

          {/* Grid of 25 Cards (3 columns on desktop, 2 on print) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3 print:gap-2">
            {messages.map((msg) => {
              const isEditing = editingNumber === msg.number;

              return (
                <div
                  key={msg.number}
                  className="page-break-inside-avoid relative p-3.5 rounded-xl border-2 border-dashed border-amber-300 bg-white shadow-xs hover:border-amber-400 transition-colors flex flex-col justify-between"
                >
                  {/* Top Bar with Number Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-dashed border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black font-tech text-sm flex items-center justify-center shadow-xs">
                        #{msg.number}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Mensaje Secreto
                      </span>
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(msg)}
                        className="no-print p-1 text-slate-400 hover:text-amber-600 rounded transition-colors"
                        title="Editar este mensaje"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Body Content */}
                  {isEditing ? (
                    <div className="space-y-2 no-print">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Título del mensaje"
                        className="w-full text-xs font-bold border border-amber-300 rounded p-1"
                      />
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Contenido que leerá el niño"
                        rows={3}
                        className="w-full text-xs border border-amber-300 rounded p-1"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingNumber(null)}
                          className="px-2 py-0.5 text-[11px] text-slate-500 rounded hover:bg-slate-100"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveEdit(msg.number)}
                          className="px-2.5 py-0.5 text-[11px] bg-amber-500 text-slate-900 font-bold rounded flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Guardar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-1">{msg.title}</h4>
                      <p className="text-xs text-slate-700 leading-snug line-clamp-4">{msg.text}</p>
                    </div>
                  )}

                  {/* Footer scissors hint */}
                  <div className="mt-2.5 pt-1 border-t border-slate-100 text-[9px] text-slate-400 flex items-center justify-between">
                    <span>✂️ Recortar por la línea</span>
                    <span className="font-semibold text-amber-600">Juego El Mensaje Secreto</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between no-print shrink-0">
          <span className="text-xs text-slate-500">25 papelitos listos para imprimir</span>
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
