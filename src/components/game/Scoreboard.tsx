import React from 'react';
// Card, Button ve Table import'ları SİLİNDİ
import { PlusCircle, RefreshCw } from 'lucide-react';
import { TOTAL_ROUNDS } from '@/lib/game-store';

interface ScoreboardProps {
  players: string[];
  scores: number[][];
  currentRound: number;
  onLogRound: () => void;
  onReset: () => void;
}

export function Scoreboard({ players, scores, currentRound, onLogRound, onReset }: ScoreboardProps) {
  const totalScores = players.map((_, playerIndex) =>
    scores.reduce((sum, roundScores) => sum + (roundScores[playerIndex] || 0), 0)
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display">Skor Tablosu</h1>
        {/* RESET BUTONU YERİNE BASİT HTML BUTON */}
        <button 
            onClick={onReset} 
            className="p-3 border rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
            title="Oyunu Sıfırla"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      
      {/* CARD BİLEŞENİ YERİNE BASİT DIV KULLANDIK */}
      <div className="shadow-lg rounded-2xl border p-4"> 
        <div className="border-b pb-2 mb-4">
          <h2 className="text-2xl font-bold">Tur {currentRound} / {TOTAL_ROUNDS}</h2>
        </div>
        
        {/* TABLO BÖLÜMÜ */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-dashed border-gray-400">
            <p className="text-red-500 font-bold mb-1 text-center">SKOR TABLOSU EKSİK</p>
            <p className="text-sm text-muted-foreground text-center mb-4">('Card', 'Table' ve 'Button' bileşenleri eksik olduğu için geçici olarak kaldırıldı.)</p>
            
            <div className="mt-3 space-y-2">
               {players.map((name, index) => (
                    <div key={index} className="flex justify-between text-lg font-medium border-b last:border-b-0 py-1">
                        <span>{name}:</span>
                        <span className="font-bold text-2xl tabular-nums">{totalScores[index]}</span>
                    </div>
                ))}
            </div>
        </div>
        
      </div>
      
      {/* LOG ROUND BUTONU YERİNE BASİT HTML BUTON */}
      <button
        onClick={onLogRound}
        className="w-full text-xl p-8 rounded-2xl bg-playful-blue text-white hover:bg-playful-blue/90 hover:scale-105 hover:shadow-lg transition-all duration-200"
      >
        <PlusCircle className="mr-2 h-6 w-6" />
        Tur {currentRound} Puanlarını Gir
      </button>
    </div>
  );
}