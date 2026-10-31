import React, { useState } from 'react';
import { X, Check, Edit3, Sparkles } from 'lucide-react';
import { SecretMessage, SpinResult } from '../types/game';
import { soundEngine } from '../utils/audio';

interface NumberDetailModalProps {
  number: number | null;
  isOpen: boolean;
  onClose: () => void;
  message: SecretMessage | undefined;
  historyItem: SpinResult | undefined;
  onUpdateMessage: (updated: SecretMessage) => void;
}

export const NumberDetailModal: React.FC<NumberDetailModalProps> = ({
  number,
  isOpen,
  onClose,
  message,
  historyItem,
  onUpdateMessage
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(message?.title || '');
  const [text, setText] = useState(message?.text || '');

  if (!isOpen || number === null) return null;

  const isDrawn = !!historyItem;

  const handleSave = () => {
    soundEngine.playKeyClick();
    if (message) {
      onUpdateMessage({
        ...message,
        title: title.trim() || `Mensaje Secreto #${number}`,
        text: text.trim() || '¡Mensaje especial!'
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black font-tech text-lg flex items-center justify-center shadow-xs">
              #{number}
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Detalle del Número #{number}
              </h3>
              <p className="text-xs text-slate-500">
                {isDrawn ? (
                  <span className="text-emerald-600 font-semibold">
                    ✓ Entregado en Turno #{historyItem.turnIndex} ({historyItem.kidName})
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold">
                    ● Aún en juego (No sorteado)
                  </span>
                )}
              </p>
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

        {/* Secret Message content */}
        <div className="mb-5 bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Contenido del Papelito</span>
            </span>

            {!isEditing && (
              <button
                onClick={() => {
                  soundEngine.playKeyClick();
                  setTitle(message?.title || '');
                  setText(message?.text || '');
                  setIsEditing(true);
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-amber-700 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar texto</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del mensaje"
                className="w-full text-xs font-bold border border-amber-300 rounded-lg p-2 bg-white"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Texto del mensaje"
                rows={4}
                className="w-full text-xs border border-amber-300 rounded-lg p-2 bg-white"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1 text-xs bg-amber-500 text-slate-900 font-bold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{message?.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed italic">"{message?.text}"</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Este mensaje corresponde al papelito #{number}</span>
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
