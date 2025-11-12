"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/theme-context';
import { useGoggings } from '@/hooks/useGoggings';
import { 
  Palette,
  Monitor,
  Sun,
  Moon,
  Crown,
  Lock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeSettings = () => {
  const { 
    theme, 
    setTheme, 
    colorPalette, 
    setColorPalette, 
    availablePalettes,
    goalColors 
  } = useTheme();
  const { user } = useGoggings();

  const themeOptions = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Modo de Tema */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Modo de Exibição
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={theme === value ? "default" : "outline"}
              onClick={() => setTheme(value)}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 O modo "Sistema" ajusta automaticamente baseado nas configurações do seu dispositivo.
          </p>
        </div>
      </Card>

      {/* Paletas de Cores */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Paletas de Cores
            </h3>
          </div>
          
          {!user.isPro && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              <Crown className="w-3 h-3 mr-1" />
              Algumas requerem Pro
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availablePalettes.map((palette) => {
            const isSelected = colorPalette.id === palette.id;
            const isLocked = palette.isPremium && !user.isPro;
            
            return (
              <div
                key={palette.id}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all cursor-pointer",
                  isSelected 
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                  isLocked && "opacity-60"
                )}
                onClick={() => !isLocked && setColorPalette(palette)}
              >
                {/* Preview da paleta */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("w-8 h-8 rounded-full bg-gradient-to-r", palette.primary)} />
                  <div className={cn("w-6 h-6 rounded-full bg-gradient-to-r", palette.secondary)} />
                  <div className={cn("w-4 h-4 rounded-full", `bg-${palette.accent}`)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {palette.name}
                    </h4>
                    {palette.isPremium && (
                      <Badge size="sm" className="mt-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : isSelected ? (
                      <Check className="w-4 h-4 text-purple-500" />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {!user.isPro && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Desbloqueie Mais Paletas
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upgrade para Goggings Pro e tenha acesso a todas as paletas exclusivas!
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Cores para Metas */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Cores para Categorização de Metas
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Use essas cores para organizar e identificar visualmente suas diferentes metas e categorias.
        </p>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {goalColors.map((color) => (
            <div
              key={color.id}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className={cn("w-8 h-8 rounded-full", color.color)} />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {color.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✨ Essas cores estarão disponíveis ao criar novas metas e na visualização diária para filtrar tarefas por categoria.
          </p>
        </div>
      </Card>

      {/* Configurações Avançadas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Configurações Avançadas
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Alto Contraste
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Melhora a legibilidade em modo escuro
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Animações Reduzidas
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reduz animações para melhor performance
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Tema Automático por Horário
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escuro à noite, claro durante o dia
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );
};