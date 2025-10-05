import React, { useState } from 'react';
import { useGameStore, LoserOptions } from '@/lib/game-store';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import { Scoreboard } from '@/components/game/Scoreboard';
import { LogRoundDialog } from '@/components/game/LogRoundDialog';
import { GameOver } from '@/components/game/GameOver';
import { Toaster, toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Gamepad2 } from 'lucide-react';
export function HomePage() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const players = useGameStore((state) => state.players);
  const scores = useGameStore((state) => state.scores);
  const currentRound = useGameStore((state) => state.currentRound);
  const startGame = useGameStore((state) => state.startGame);
  const logRound = useGameStore((state) => state.logRound);
  const resetGame = useGameStore((state) => state.resetGame);
  const [isLogRoundDialogOpen, setLogRoundDialogOpen] = useState(false);
  const handleGameStart = (playerNames: string[]) => {
    startGame(playerNames);
    toast.success('Oyun Başladı!', { description: 'İyi şanslar!' });
  };
  const handleLogRoundSubmit = (
    winnerIndex: number,
    loserScores: { [playerIndex: number]: number },
    loserOptions: LoserOptions,
    coefficient: number,
    isWinnerCift: boolean,
    isWinnerOkeyAtti: boolean
  ) => {
    const roundJustCompleted = currentRound;
    logRound(winnerIndex, loserScores, loserOptions, coefficient, isWinnerCift, isWinnerOkeyAtti);
    toast.success(`Tur ${roundJustCompleted} kaydedildi!`, {
      description: `${players[winnerIndex]} bu eli kazandı.`,
    });
  };
  const handleReset = () => {
    resetGame();
    toast.info('Oyun sıfırlandı.');
  };
  const renderGameState = () => {
    switch (gameStatus) {
      case 'setup':
        return <PlayerSetup onGameStart={handleGameStart} />;
      case 'playing':
        return (
          <>
            <Scoreboard
              players={players}
              scores={scores}
              currentRound={currentRound}
              onLogRound={() => setLogRoundDialogOpen(true)}
              onReset={handleReset}
            />
            <LogRoundDialog
              isOpen={isLogRoundDialogOpen}
              onOpenChange={setLogRoundDialogOpen}
              players={players}
              currentRound={currentRound}
              onSubmit={handleLogRoundSubmit}
            />
          </>
        );
      case 'finished':
        return <GameOver players={players} scores={scores} onReset={handleReset} />;
      default:
        return <PlayerSetup onGameStart={handleGameStart} />;
    }
  };
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <ThemeToggle className="absolute top-4 right-4 z-50" />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {gameStatus !== 'setup' && (
          <header className="flex items-center justify-center space-x-4 mb-8">
            <Gamepad2 className="h-10 w-10 text-playful-blue" />
            <h1 className="text-5xl font-display text-center">SADDAM</h1>
          </header>
        )}
        {renderGameState()}
      </div>
      <footer className="absolute bottom-4 w-full text-center text-muted-foreground/80">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Toaster richColors closeButton />
    </main>
  );
}