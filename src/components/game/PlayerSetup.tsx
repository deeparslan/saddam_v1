import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
const playerSetupSchema = z.object({
  players: z.array(z.object({ name: z.string().min(1, 'İsim boş olamaz').max(20, 'İsim çok uzun') })).length(4, '4 oyuncu ismi girmelisiniz'),
});
type PlayerSetupFormValues = z.infer<typeof playerSetupSchema>;
interface PlayerSetupProps {
  onGameStart: (playerNames: string[]) => void;
}
export function PlayerSetup({ onGameStart }: PlayerSetupProps) {
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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md animate-scale-in shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-playful-blue text-white rounded-full">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-4xl font-display">Oyuncuları Ayarla</CardTitle>
          <CardDescription className="text-lg">4 oyuncunun ismini girerek oyuna başla.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`players.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Oyuncu {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Oyuncu ${index + 1} ismi`}
                            {...field}
                            className="text-lg p-6 rounded-2xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button
                type="submit"
                className="w-full text-xl p-8 rounded-2xl bg-playful-blue hover:bg-playful-blue/90 hover:scale-105 hover:shadow-lg transition-all duration-200"
              >
                Oyuna Başla
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}