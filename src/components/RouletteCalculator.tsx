import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, User, RefreshCw, Trophy } from 'lucide-react';
import { RouletteWheel } from './RouletteWheel';
import { SecretMessage, SpinResult } from '../types/game';
import { soundEngine } from '../utils/audio';

interface RouletteCalculatorProps {
  availableNumbers: number[];
  drawnNumbers: number[];
  messages: SecretMessage[];
  onNumberDrawn: (result: SpinResult) => void;
  onResetGame: () => void;
  historyCount: number;
}

export const RouletteCalculator: React.FC<RouletteCalculatorProps> = ({
  availableNumbers,
  drawnNumbers,
  messages,
  onNumberDrawn,
  onResetGame,
  historyCount
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [kidName, setKidName] = useState('');
  const [displayNumber, setDisplayNumber] = useState<string>('--');
  const [displayText, setDisplayText] = useState('LISTO PARA DESCUBRIR');
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const spinIntervalRef = useRef<number | null>(null);
  const audioTickIntervalRef = useRef<number | null>(null);

  const totalSegments = 25;
  const segmentAngle = 360 / totalSegments; // 14.4 deg

  // Keep display in sync when numbers change
  useEffect(() => {
    if (availableNumbers.length === 0) {
      setDisplayNumber('FIN');
      setDisplayText('¡TODOS LOS MENSAJES REVELADOS!');
    } else if (!isSpinning && winningNumber === null) {
      setDisplayNumber(availableNumbers.length < 25 ? `${availableNumbers.length}` : '25');
      setDisplayText('TOCA EL BOTÓN PARA GIRAR');
    }
  }, [availableNumbers.length, isSpinning, winningNumber]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playKeyClick();
    }
  };

  const handleSpin = () => {
    if (isSpinning || availableNumbers.length === 0) return;

    soundEngine.playBigButton();
    setIsSpinning(true);
    setWinningNumber(null);
    setDisplayText('GIRANDO RULETA MISTERIOSA...');

    // Pick a random number strictly from AVAILABLE numbers
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const chosenNumber = availableNumbers[randomIndex];

    // Compute target rotation:
    // Sector 1 is at angle 0 to 14.4 deg (starts at 12 o'clock).
    // Center of sector k (1-indexed) is (k - 0.5) * segmentAngle.
    // To bring sector k to top pointer (0 deg), we need wheel to rotate such that:
    // pointer lands on sector k.
    // Since wheel rotates clockwise by R degrees:
    // pointer relative to wheel moves counter-clockwise.
    // The angle of sector k center is: centerAngle = (chosenNumber - 1 + 0.5) * segmentAngle
    // So relative target = 360 - centerAngle
    const sectorCenterAngle = (chosenNumber - 1 + 0.5) * segmentAngle;
    const targetOffset = 360 - sectorCenterAngle;

    // Add 6 to 9 full spins for suspense (2160 to 3240 deg)
    const fullSpins = (6 + Math.floor(Math.random() * 3)) * 360;
    const currentBase = Math.floor(wheelRotation / 360) * 360;
    const nextRotation = currentBase + fullSpins + targetOffset;

    setWheelRotation(nextRotation);

    // Rapid scramble digits on LCD screen
    const startTime = Date.now();
    const duration = 4200; // 4.2s matches CSS bezier

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    spinIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration - 400) {
        // Fast random available number display
        const tempNum = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        setDisplayNumber(tempNum < 10 ? `0${tempNum}` : `${tempNum}`);
      } else {
        // Lock onto chosen number
        setDisplayNumber(chosenNumber < 10 ? `0${chosenNumber}` : `${chosenNumber}`);
      }
    }, 65);

    // Audio ticking mimicking mechanical ratchet deceleration
    let tickCount = 0;
    const playProgressiveTicks = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) return;

      soundEngine.playSpinTick(0.8 + Math.min(1.2, (duration - elapsed) / 1000));
      tickCount++;

      // Gradually increase interval as wheel slows down
      const progress = elapsed / duration;
      const nextDelay = 40 + Math.pow(progress, 3) * 380;

      audioTickIntervalRef.current = window.setTimeout(playProgressiveTicks, nextDelay);
    };

    audioTickIntervalRef.current = window.setTimeout(playProgressiveTicks, 40);

    // On finish spinning
    setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (audioTickIntervalRef.current) clearTimeout(audioTickIntervalRef.current);

      setIsSpinning(false);
      setWinningNumber(chosenNumber);
      setDisplayNumber(chosenNumber < 10 ? `0${chosenNumber}` : `${chosenNumber}`);
      setDisplayText(`¡NÚMERO SECRET #${chosenNumber}!`);

      // Find message
      const secretMsg = messages.find((m) => m.number === chosenNumber) || {
        number: chosenNumber,
        title: `Mensaje Secreto #${chosenNumber}`,
        text: '¡Eres un participante fantástico!',
        category: 'positivo'
      };

      const result: SpinResult = {
        id: `spin-${Date.now()}-${chosenNumber}`,
        number: chosenNumber,
        kidName: kidName.trim() || `Explorador #${historyCount + 1}`,
        turnIndex: historyCount + 1,
        timestamp: Date.now(),
        message: secretMsg
      };

      // Notify parent to open modal & update state
      onNumberDrawn(result);

      // Reset kid name field for next child
      setKidName('');
    }, duration);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Outer Calculator Shell */}
      <div className="relative rounded-[40px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-5 sm:p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border-4 border-slate-700/80">
        {/* Top Trim: Solar Cell Panel & Brand Strip */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-700/70">
          {/* Solar cell mock */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 shadow-inner">
            <div className="w-4 h-5 bg-amber-950/80 rounded-xs border border-amber-800/60" />
            <div className="w-4 h-5 bg-amber-950/80 rounded-xs border border-amber-800/60" />
            <div className="w-4 h-5 bg-amber-950/80 rounded-xs border border-amber-800/60" />
            <div className="w-4 h-5 bg-amber-950/80 rounded-xs border border-amber-800/60" />
            <span className="text-[9px] font-mono font-bold text-amber-500/80 tracking-widest ml-1">
              SOLAR
            </span>
          </div>

          {/* Model label */}
          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-400 font-tech">
              CALC-RULETA · MOD-25
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>

        {/* Retro LCD Display Screen */}
        <div className="mb-6 rounded-2xl p-4 sm:p-5 lcd-screen-surface border-4 border-slate-800 relative overflow-hidden">
          {/* Scanline pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.06)_50%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Screen Top Header */}
          <div className="relative flex items-center justify-between text-[11px] sm:text-xs font-mono font-bold text-emerald-900 border-b border-emerald-700/20 pb-1 mb-2">
            <span>EL MENSAJE SECRETO</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>DISPONIBLES: {availableNumbers.length} / 25</span>
            </span>
          </div>

          {/* Big Number Output */}
          <div className="relative flex items-center justify-between py-1">
            <div className="text-left">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                NÚMERO SORTEADO
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-950">
                {displayText}
              </span>
            </div>

            <div className="text-right">
              <span className="font-digital text-5xl sm:text-6xl font-bold tracking-wider text-emerald-950 drop-shadow-xs">
                {displayNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Roulette Chamber (Embedded Wheel) */}
        <div className="mb-6 bg-slate-950/70 p-3 sm:p-4 rounded-3xl border-2 border-slate-800 shadow-inner">
          <RouletteWheel
            rotation={wheelRotation}
            isSpinning={isSpinning}
            availableNumbers={availableNumbers}
            drawnNumbers={drawnNumbers}
            winningNumber={winningNumber}
          />
        </div>

        {/* Kid Name Input (Optional for classroom personalization) */}
        <div className="mb-4 bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/80 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            disabled={isSpinning || availableNumbers.length === 0}
            placeholder={`Nombre del explorador (ej: Sofía, o Niño #${historyCount + 1})`}
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 font-medium focus:outline-hidden disabled:opacity-50"
            maxLength={30}
          />
          {kidName && (
            <button
              onClick={() => setKidName('')}
              className="text-xs text-slate-400 hover:text-white px-1.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Giant Main Push Button ("GIRAR RULETA") */}
        <div className="mb-6">
          {availableNumbers.length > 0 ? (
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-3 transition-all ${
                isSpinning
                  ? 'bg-amber-600/80 text-white cursor-wait opacity-85'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 btn-calculator-3d hover:brightness-105 active:scale-[0.98]'
              }`}
            >
              <Sparkles className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? '¡Buscando Número...' : '¡Girar y Descubrir Número!'}</span>
              <Sparkles className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            </button>
          ) : (
            <div className="p-4 bg-emerald-950/80 rounded-2xl border-2 border-emerald-500 text-center text-emerald-200">
              <Trophy className="w-8 h-8 mx-auto text-amber-400 mb-1 animate-bounce" />
              <p className="font-bold text-sm sm:text-base text-white">
                ¡Felicidades! Se han descubierto los 25 mensajes secretos
              </p>
              <p className="text-xs text-emerald-300 mt-1 mb-3">
                Todos los niños tienen ya su número asignado.
              </p>
              <button
                onClick={onResetGame}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reiniciar para un Nuevo Grupo</span>
              </button>
            </div>
          )}
        </div>

        {/* Calculator Keypad Summary (Visual indicator of all 25 numbers) */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
            <span>TECLADO RÁPIDO (1 - 25)</span>
            <span className="text-amber-400">Verde: Disponible · Gris: Revelado</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {Array.from({ length: 25 }, (_, idx) => {
              const num = idx + 1;
              const isDrawn = drawnNumbers.includes(num);
              const isWinner = winningNumber === num;

              return (
                <div
                  key={num}
                  className={`h-9 sm:h-10 rounded-xl flex items-center justify-center font-tech font-bold text-xs sm:text-sm select-none transition-all ${
                    isWinner
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-105 shadow-lg'
                      : isDrawn
                      ? 'bg-slate-800/80 text-slate-500 border border-slate-700/60 line-through opacity-60'
                      : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 btn-key-3d shadow-xs'
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
