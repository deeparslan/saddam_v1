import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Eksik UI Bileşenleri SİLİNDİ: Button, Input, Form, Card importları
import { Users } from 'lucide-react';

// PlayerSetup bileşenlerinin kullandığı form şeması ve tipler korundu
const playerSetupSchema = z.object({
  players: z.array(z.object({ name: z.string().min(1, 'İsim boş olamaz').max(20, 'İsim çok uzun') })).length(4, '4 oyuncu ismi girmelisiniz'),
});
type PlayerSetupFormValues = z.infer<typeof playerSetupSchema>;

interface PlayerSetupProps {
  onGameStart: (playerNames: string[]) => void;
}

export function PlayerSetup({ onGameStart }: PlayerSetupProps) {
  // useForm ayarları korundu
  const form = useForm<PlayerSetupFormValues>({
    resolver: zodResolver(playerSetupSchema),
    defaultValues: {
      players: [{ name: '' }, { name: '' }, { name: '' }, { name: '' }],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'players',
  });

  const onSubmit = (data: PlayerSetupFormValues) => {
    onGameStart(data.players.map(p => p.name));
  };

  // JSX: Eksik bileşenler (Card, Form, Input, Button) yerine temel HTML kullanıldı.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 p-4">
      {/* CARD YERİNE DIV KULLANILDI */}
      <div className="w-full max-w-md animate-scale-in shadow-lg rounded-2xl border bg-white dark:bg-gray-900 p-6">
        
        {/* CARD HEADER YERİNE DIV KULLANILDI */}
        <header className="text-center pb-4 border-b">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-playful-blue text-white rounded-full">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold">Oyuncuları Ayarla</h1>
          <p className="text-lg text-gray-500 mt-2">4 oyuncunun ismini girerek oyuna başla.</p>
        </header>

        {/* CARD CONTENT YERİNE DIV KULLANILDI */}
        <div className="pt-6">
          {/* Form ve FormField yapısı React Hook Form kullanımı için basitleştirildi. */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-1">
                  <label htmlFor={`player-${index}`} className="text-lg block">Oyuncu {index + 1}</label>
                  {/* INPUT YERİNE BASİT HTML INPUT KULLANILDI */}
                  <input
                    id={`player-${index}`}
                    placeholder={`Oyuncu ${index + 1} ismi`}
                    {...form.register(`players.${index}.name`)}
                    className="w-full text-lg p-3 border border-gray-300 rounded-lg"
                  />
                  {/* Hata mesajı gösterimi eklendi */}
                  {form.formState.errors.players?.[index]?.name && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.players[index]?.name?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            {/* BUTTON YERİNE BASİT HTML BUTTON KULLANILDI */}
            <button
              type="submit"
              className="w-full text-xl p-4 rounded-2xl bg-playful-blue text-white font-bold hover:bg-playful-blue/90 transition-all duration-200"
            >
              Oyuna Başla
            </button>
            {/* Genel form hata mesajı */}
            {form.formState.errors.players && typeof form.formState.errors.players.message === 'string' && (
              <p className="text-red-500 text-center text-sm">{form.formState.errors.players.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}