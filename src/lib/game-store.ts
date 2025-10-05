import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
export const TOTAL_ROUNDS = 11;
export type LoserOptions = {
  [playerIndex: number]: {
    isCift: boolean;
    isOkeyeDonuyor: boolean;
  };
};
export type GameState = {
  players: string[];
  scores: number[][]; // scores[round][playerIndex]
  currentRound: number; // 1-based index
  gameStatus: 'setup' | 'playing' | 'finished';
};
type GameActions = {
  startGame: (playerNames: string[]) => void;
  logRound: (
    winnerIndex: number,
    loserScores: { [playerIndex: number]: number },
    loserOptions: LoserOptions,
    coefficient: number,
    isWinnerCift: boolean,
    isWinnerOkeyAtti: boolean
  ) => void;
  resetGame: () => void;
};
const initialState: GameState = {
  players: [],
  scores: [],
  currentRound: 1,
  gameStatus: 'setup',
};
export const useGameStore = create<GameState & GameActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      startGame: (playerNames) => {
        set((state) => {
          state.players = playerNames;
          state.scores = Array(TOTAL_ROUNDS)
            .fill(null)
            .map(() => Array(4).fill(0));
          state.currentRound = 1;
          state.gameStatus = 'playing';
        });
      },
      logRound: (winnerIndex, loserScores, loserOptions, coefficient, isWinnerCift, isWinnerOkeyAtti) => {
        set((state) => {
          const roundIndex = state.currentRound - 1;
          const isFinalRound = state.currentRound === TOTAL_ROUNDS;
          const roundMultiplier = isFinalRound ? 10 : 1;
          // --- Winner Score Calculation ---
          let winnerBaseScore = -100;
          if (isWinnerOkeyAtti) {
            winnerBaseScore = -200; // Okey attı doubles the base score
          }
          if (isWinnerCift) {
            winnerBaseScore *= coefficient; // Çift multiplies by coefficient
          }
          state.scores[roundIndex][winnerIndex] = winnerBaseScore * roundMultiplier;
          // --- Loser Score Calculation ---
          // If winner finished with Çift AND Okey attı, multiplier is 4.
          // If winner finished with Çift OR Okey attı, multiplier is 2.
          // Otherwise, it's 1.
          let winnerFinishMultiplier = 1;
          if (isWinnerCift && isWinnerOkeyAtti) {
            winnerFinishMultiplier = 4;
          } else if (isWinnerCift || isWinnerOkeyAtti) {
            winnerFinishMultiplier = 2;
          }
          state.players.forEach((_, playerIndex) => {
            if (playerIndex === winnerIndex) return; // Skip winner
            const options = loserOptions[playerIndex] || { isCift: false, isOkeyeDonuyor: false };
            let basePenalty = 0;
            if (options.isOkeyeDonuyor) {
              // Penalty for "Okey'e dönüyor" is 100 * coefficient.
              // If they also finished "Çift", this penalty is doubled.
              const ciftMultiplier = options.isCift ? 2 : 1;
              basePenalty = 100 * coefficient * ciftMultiplier;
            } else {
              const score = loserScores[playerIndex] ?? 0;
              // Penalty for "Çift" is doubled.
              const ciftMultiplier = options.isCift ? 2 : 1;
              basePenalty = score * coefficient * ciftMultiplier;
            }
            const finalPenalty = basePenalty * winnerFinishMultiplier * roundMultiplier;
            state.scores[roundIndex][playerIndex] = finalPenalty;
          });
          if (isFinalRound) {
            state.gameStatus = 'finished';
          } else {
            state.currentRound += 1;
          }
        });
      },
      resetGame: () => {
        set((state) => {
          Object.assign(state, initialState);
        });
      },
    })),
    {
      name: 'skor-arkadasi-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);