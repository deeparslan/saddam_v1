import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        <Button onClick={onReset} variant="outline" size="icon" className="rounded-full hover:bg-red-500 hover:text-white transition-colors">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Tur {currentRound} / {TOTAL_ROUNDS}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg font-bold">Oyuncu</TableHead>
                <TableHead className="text-right text-lg font-bold">Toplam Puan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((name, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-lg">{name}</TableCell>
                  <TableCell className="text-right font-bold text-2xl tabular-nums">{totalScores[index]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button
        onClick={onLogRound}
        className="w-full text-xl p-8 rounded-2xl bg-playful-blue hover:bg-playful-blue/90 hover:scale-105 hover:shadow-lg transition-all duration-200"
      >
        <PlusCircle className="mr-2 h-6 w-6" />
        Tur {currentRound} Puanlarını Gir
      </Button>
    </div>
  );
}