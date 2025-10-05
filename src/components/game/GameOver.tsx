import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, PartyPopper, Trophy } from 'lucide-react';
interface GameOverProps {
  players: string[];
  scores: number[][];
  onReset: () => void;
}
const ConfettiPiece = () => {
  const colors = ['#3B82F6', '#FDE047', '#EF4444', '#111827'];
  const x = Math.random() * 100;
  const y = Math.random() * -50 - 50;
  const duration = Math.random() * 3 + 2;
  const delay = Math.random() * 2;
  const rotate = Math.random() * 360;
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}vw`,
        top: `${y}vh`,
        width: '10px',
        height: '20px',
        backgroundColor: color,
        rotate: `${rotate}deg`,
      }}
      initial={{ y: y, opacity: 1 }}
      animate={{ y: '120vh', rotate: rotate + 360 }}
      transition={{ duration, delay, ease: 'linear', repeat: Infinity }}
    />
  );
};
export function GameOver({ players, scores, onReset }: GameOverProps) {
  const totalScores = players.map((_, playerIndex) =>
    scores.reduce((sum, roundScores) => sum + (roundScores[playerIndex] || 0), 0)
  );
  const winnerIndex = totalScores.indexOf(Math.min(...totalScores));
  const winnerName = players[winnerIndex];
  const sortedPlayers = players
    .map((name, index) => ({ name, score: totalScores[index] }))
    .sort((a, b) => a.score - b.score);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 p-4 relative overflow-hidden">
      {Array.from({ length: 100 }).map((_, i) => <ConfettiPiece key={i} />)}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-md z-10"
      >
        <Card className="text-center shadow-2xl rounded-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy className="w-20 h-20 text-playful-yellow" />
              </motion.div>
            </div>
            <CardTitle className="text-5xl font-display">Oyun Bitti!</CardTitle>
            <CardDescription className="text-xl">İşte sonuçlar:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-playful-yellow/20 p-4 rounded-2xl border-2 border-playful-yellow">
              <h3 className="text-lg font-semibold">Kazanan</h3>
              <p className="text-4xl font-bold text-playful-yellow flex items-center justify-center gap-2">
                <Crown /> {winnerName}
              </p>
              <p className="text-2xl font-bold">{totalScores[winnerIndex]} Puan</p>
            </div>
            <div className="space-y-2 text-left">
              {sortedPlayers.map((player, index) => (
                <div key={player.name} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-lg font-medium">{index + 1}. {player.name}</span>
                  <span className="text-lg font-bold">{player.score}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={onReset}
              className="w-full text-xl p-8 rounded-2xl bg-playful-blue hover:bg-playful-blue/90 hover:scale-105 transition-transform"
            >
              <PartyPopper className="mr-2 h-6 w-6" />
              Yeni Oyun
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}