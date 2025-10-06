import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// SİLİNDİ: Button, Input, Form, Dialog, Select, Checkbox, ScrollArea, cn
import { Star } from 'lucide-react';
import { LoserOptions } from '@/lib/game-store';

const colorCoefficients = {
  blue: 5,
  red: 4,
  yellow: 3,
  black: 6,
  star: 10,
};
type Color = keyof typeof colorCoefficients;

// Form şeması ve tipler korundu
const logRoundSchema = z.object({
  winner: z.string().min(1, 'Kazanan seçmelisiniz.'),
  isWinnerCift: z.boolean(),
  isWinnerOkeyAtti: z.boolean(),
  scores: z.record(
    z.string(),
    z.number().min(0, 'Puan negatif olamaz.').max(500, 'Puan çok yüksek.').optional()
  ),
  loserOptions: z.record(
    z.string(),
    z.object({
      isCift: z.boolean(),
      isOkeyeDonuyor: z.boolean(),
    })
  ),
});
type LogRoundFormValues = z.infer<typeof logRoundSchema>;

interface LogRoundDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  players: string[];
  currentRound: number;
  onSubmit: (
    winnerIndex: number,
    loserScores: { [playerIndex: number]: number },
    loserOptions: LoserOptions,
    coefficient: number,
    isWinnerCift: boolean,
    isWinnerOkeyAtti: boolean
  ) => void;
}

export function LogRoundDialog({ isOpen, onOpenChange, players, currentRound, onSubmit }: LogRoundDialogProps) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const form = useForm<LogRoundFormValues>({
    resolver: zodResolver(logRoundSchema),
    defaultValues: {
      winner: '',
      isWinnerCift: false,
      isWinnerOkeyAtti: false,
      scores: {},
      loserOptions: players.reduce((acc, _, index) => {
        acc[index] = { isCift: false, isOkeyeDonuyor: false };
        return acc;
      }, {} as LogRoundFormValues['loserOptions']),
    },
  });

  const winner = form.watch('winner');
  const scores = form.watch('scores');
  const loserOptions = form.watch('loserOptions');
  const winnerIndex = winner ? parseInt(winner, 10) : -1;

  useEffect(() => {
    if (isOpen) {
      const initialLoserOptions: { [key: string]: { isCift: boolean; isOkeyeDonuyor: boolean } } = {};
      players.forEach((_, index) => {
        initialLoserOptions[index] = { isCift: false, isOkeyeDonuyor: false };
      });
      form.reset({
        winner: '',
        isWinnerCift: false,
        isWinnerOkeyAtti: false,
        scores: {},
        loserOptions: initialLoserOptions,
      });
      setSelectedColor(null);
    }
  }, [isOpen, form, players]);

  const otherPlayers = players.map((_, index) => index).filter((index) => index !== winnerIndex);
  
  const allScoresFilled =
    winnerIndex !== -1 &&
    otherPlayers.every((index) => {
      const isOkeyeDonuyor = loserOptions?.[index]?.isOkeyeDonuyor;
      if (isOkeyeDonuyor) return true;
      const score = scores?.[index];
      return score !== undefined && score !== null && !isNaN(score);
    });

  const handleFormSubmit = (data: LogRoundFormValues) => {
    if (!selectedColor) {
      form.setError('root', { type: 'manual', message: 'Lütfen bir renk seçin.' });
      return;
    }
    const loserScores: { [playerIndex: number]: number } = {};
    players.forEach((_, index) => {
      if (index !== winnerIndex) {
        loserScores[index] = data.scores?.[index] || 0;
      }
    });
    onSubmit(winnerIndex, loserScores, data.loserOptions, colorCoefficients[selectedColor], data.isWinnerCift, data.isWinnerOkeyAtti);
    onOpenChange(false);
  };
  
  const isFormValid = form.formState.isValid && selectedColor !== null && allScoresFilled;
  
  // Dialog yerine basit DIV ve Modalsız yaklaşım
  if (!isOpen) return null;

  return (
    // DIALOG YERİNE SABİT VE BASİT BİR MODAL KULLANILDI
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
        
        {/* DIALOG HEADER YERİNE BASİT HEADER */}
        <header className="pb-4 mb-4 border-b">
          <h2 className="text-3xl font-display font-bold">Tur {currentRound} Puanları</h2>
          <p className="text-lg text-muted-foreground">Kazananı, rengi ve diğer oyuncuların ceza puanlarını girin.</p>
        </header>
        
        {/* FORM YERİNE BASİT FORM */}
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            
            {/* SCROLL AREA YERİNE DIV */}
            <div className="space-y-6">
                <div>
                  <label className="text-lg block mb-2">Renk Katsayısı</label>
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {(Object.keys(colorCoefficients) as Color[]).map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          form.clearErrors('root');
                        }}
                        // Tailwind sınıfları, cn fonksiyonu olmadığı için kısmen manuel eklendi
                        className={`h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center 
                          ${selectedColor === color ? 'scale-105 shadow-lg border-4' : 'opacity-70 hover:opacity-100'}
                          ${color === 'blue' ? 'border-blue-500' : ''}
                          ${color === 'red' ? 'border-red-500' : ''}
                          ${color === 'yellow' ? 'border-yellow-500' : ''}
                          ${color === 'black' ? 'border-gray-900' : ''}
                          ${color === 'star' ? 'bg-gray-900 border-white/50' : 'bg-white'}`}
                      >
                        {color === 'star' ? (
                          <Star className="w-6 h-6 text-white" />
                        ) : (
                          <Star
                            className={`w-6 h-6 ${color === 'blue' ? 'text-blue-500 fill-blue-500' : ''}
                            ${color === 'red' ? 'text-red-500 fill-red-500' : ''}
                            ${color === 'yellow' ? 'text-yellow-500 fill-yellow-500' : ''}
                            ${color === 'black' ? 'text-gray-900 fill-gray-900' : ''}`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  {/* FormMessage yerine basit p etiketi */}
                  {form.formState.errors.root?.message && (
                     <p className="text-red-500 text-sm text-center pt-2">{form.formState.errors.root.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-lg block">Kazanan</label>
                  {/* SELECT YERİNE BASİT HTML SELECT */}
                  <select 
                    {...form.register("winner")} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-white"
                  >
                    <option value="" disabled>Kazanan oyuncuyu seçin</option>
                    {players.map((name, index) => (
                      <option key={index} value={String(index)}>{name}</option>
                    ))}
                  </select>
                  {form.formState.errors.winner && (
                    <p className="text-red-500 text-sm">{form.formState.errors.winner.message}</p>
                  )}
                </div>

                {winnerIndex !== -1 && (
                  <div className="p-4 border rounded-2xl space-y-4">
                    <label className="text-lg block">Kazanan Bitiş Türü</label>
                    <div className="flex items-center space-x-4 pt-2">
                      {/* Çift Checkbox */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isWinnerCift"
                          {...form.register("isWinnerCift")}
                          className="w-4 h-4"
                        />
                        <label htmlFor="isWinnerCift">Çift</label>
                      </div>
                      {/* Okey Attı Checkbox */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isWinnerOkeyAtti"
                          {...form.register("isWinnerOkeyAtti")}
                        />
                        <label htmlFor="isWinnerOkeyAtti">Okey attı</label>
                      </div>
                    </div>
                  </div>
                )}
                
                {winnerIndex !== -1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ceza Puanları</h3>
                    {players.map((name, index) => {
                      if (index === winnerIndex) return null;
                      const isOkeyeDonuyor = loserOptions?.[index]?.isOkeyeDoniyor;
                      return (
                        <div key={index} className="p-4 border rounded-2xl space-y-4 bg-muted/50">
                          
                            <div className="space-y-1">
                                <label className="text-lg block">{name} (Kalan Taş Toplamı)</label>
                                {/* INPUT YERİNE BASİT HTML INPUT */}
                                <input
                                    type="number"
                                    placeholder="Ceza puanı"
                                    {...form.register(`scores.${index}`, { valueAsNumber: true })}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                                    disabled={isOkeyeDonuyor}
                                />
                                {form.formState.errors.scores && form.formState.errors.scores[index] && (
                                    <p className="text-red-500 text-sm">
                                        {(form.formState.errors.scores[index] as any)?.message}
                                    </p>
                                )}
                            </div>
                          
                          <div className="flex items-center space-x-4">
                            {/* Çift Checkbox */}
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`isCift-${index}`}
                                {...form.register(`loserOptions.${index}.isCift`)}
                                className="w-4 h-4"
                              />
                              <label htmlFor={`isCift-${index}`}>Çift</label>
                            </div>
                            
                            {/* Okey'e Dönüyor Checkbox */}
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`isOkeyeDonuyor-${index}`}
                                {...form.register(`loserOptions.${index}.isOkeyeDonuyor`, {
                                  onChange: (e) => {
                                    if (e.target.checked) {
                                      form.setValue(`scores.${index}`, undefined);
                                    }
                                  }
                                })}
                              />
                              <label htmlFor={`isOkeyeDonuyor-${index}`}>Okey'e dönüyor</label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
            
            <div className="pt-4">
              {/* BUTTON YERİNE BASİT HTML BUTTON */}
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full text-xl p-4 rounded-2xl bg-playful-blue text-white font-bold hover:bg-playful-blue/90 disabled:bg-gray-400 disabled:opacity-70 transition-colors"
              >
                Turu Kaydet
              </button>
            </div>
          </form>

        {/* Diyalog kapatma butonu (X) */}
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}