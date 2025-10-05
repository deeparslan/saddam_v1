import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl flex flex-col h-[90vh] max-h-[700px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display">Tur {currentRound} Puanları</DialogTitle>
          <DialogDescription className="text-lg">Kazananı, rengi ve diğer oyuncuların ceza puanlarını girin.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col flex-grow overflow-hidden">
            <ScrollArea className="flex-grow pr-6 -mr-6">
              <div className="space-y-6">
                <div>
                  <FormLabel className="text-lg">Renk Katsayısı</FormLabel>
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {(Object.keys(colorCoefficients) as Color[]).map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          form.clearErrors('root');
                        }}
                        className={cn(
                          'h-24 rounded-lg border-2 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                          selectedColor === color ? 'scale-105 shadow-lg' : 'opacity-70 hover:opacity-100',
                          color === 'blue' && 'bg-white border-playful-blue',
                          color === 'red' && 'bg-white border-playful-red',
                          color === 'yellow' && 'bg-white border-playful-yellow',
                          color === 'black' && 'bg-white border-playful-black',
                          color === 'star' && 'bg-playful-black border-white/50'
                        )}
                      >
                        {color === 'star' ? (
                          <Star className="w-7 h-7 text-white" />
                        ) : (
                          <Star
                            className={cn(
                              'w-7 h-7',
                              color === 'blue' && 'text-playful-blue fill-playful-blue',
                              color === 'red' && 'text-playful-red fill-playful-red',
                              color === 'yellow' && 'text-playful-yellow fill-playful-yellow',
                              color === 'black' && 'text-playful-black fill-playful-black'
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <FormMessage className="text-center pt-2">{form.formState.errors.root?.message}</FormMessage>
                </div>
                <FormField
                  control={form.control}
                  name="winner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Kazanan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="p-6 rounded-2xl text-lg">
                            <SelectValue placeholder="Kazanan oyuncuyu seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {players.map((name, index) => (
                            <SelectItem key={index} value={String(index)} className="text-lg">
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {winnerIndex !== -1 && (
                  <div className="p-4 border rounded-2xl space-y-4">
                    <FormLabel className="text-lg">Kazanan Bitiş Türü</FormLabel>
                    <div className="flex items-center space-x-4 pt-2">
                      <FormField
                        control={form.control}
                        name="isWinnerCift"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Çift</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isWinnerOkeyAtti"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Okey attı</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                {winnerIndex !== -1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ceza Puanları</h3>
                    {players.map((name, index) => {
                      if (index === winnerIndex) return null;
                      const isOkeyeDonuyor = loserOptions?.[index]?.isOkeyeDonuyor;
                      return (
                        <div key={index} className="p-4 border rounded-2xl space-y-4">
                          <FormField
                            control={form.control}
                            name={`scores.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg">{name} (Kalan Taş Toplamı)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Ceza puanı"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(value === '' ? undefined : Number(value));
                                    }}
                                    value={field.value ?? ''}
                                    className="p-6 rounded-2xl text-lg"
                                    disabled={isOkeyeDonuyor}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-center space-x-4">
                            <FormField
                              control={form.control}
                              name={`loserOptions.${index}.isCift`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Çift</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`loserOptions.${index}.isOkeyeDonuyor`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked) {
                                          form.setValue(`scores.${index}`, undefined);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Okey'e dönüyor</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="pt-6">
              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full text-xl p-8 rounded-2xl bg-playful-blue hover:bg-playful-blue/90 disabled:bg-muted disabled:opacity-50"
              >
                Turu Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}