export interface SecretMessage {
  number: number;
  title: string;
  text: string;
  category: 'reto' | 'positivo' | 'adivinanza' | 'curiosidad';
}

export interface SpinResult {
  id: string;
  number: number;
  kidName: string;
  turnIndex: number;
  timestamp: number;
  message: SecretMessage;
}

export type PresetCategory = 'mixto' | 'valores' | 'retos' | 'adivinanzas' | 'curiosidades';
