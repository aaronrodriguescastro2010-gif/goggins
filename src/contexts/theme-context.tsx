"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ColorPalette = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  isPremium?: boolean;
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'purple',
    name: 'Roxo Clássico',
    primary: 'from-purple-500 to-blue-500',
    secondary: 'from-purple-100 to-blue-100',
    accent: 'purple-500',
    background: 'from-blue-50 via-purple-50 to-pink-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200'
  },
  {
    id: 'emerald',
    name: 'Verde Esmeralda',
    primary: 'from-emerald-500 to-teal-500',
    secondary: 'from-emerald-100 to-teal-100',
    accent: 'emerald-500',
    background: 'from-emerald-50 via-teal-50 to-cyan-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200'
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    primary: 'from-orange-500 to-pink-500',
    secondary: 'from-orange-100 to-pink-100',
    accent: 'orange-500',
    background: 'from-orange-50 via-pink-50 to-red-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200',
    isPremium: true
  },
  {
    id: 'ocean',
    name: 'Oceano Profundo',
    primary: 'from-blue-600 to-cyan-500',
    secondary: 'from-blue-100 to-cyan-100',
    accent: 'blue-600',
    background: 'from-blue-50 via-cyan-50 to-teal-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200',
    isPremium: true
  },
  {
    id: 'forest',
    name: 'Floresta Mística',
    primary: 'from-green-600 to-emerald-500',
    secondary: 'from-green-100 to-emerald-100',
    accent: 'green-600',
    background: 'from-green-50 via-emerald-50 to-teal-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200',
    isPremium: true
  },
  {
    id: 'royal',
    name: 'Realeza',
    primary: 'from-indigo-600 to-purple-600',
    secondary: 'from-indigo-100 to-purple-100',
    accent: 'indigo-600',
    background: 'from-indigo-50 via-purple-50 to-pink-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200',
    isPremium: true
  },
  {
    id: 'cherry',
    name: 'Cereja Doce',
    primary: 'from-rose-500 to-pink-500',
    secondary: 'from-rose-100 to-pink-100',
    accent: 'rose-500',
    background: 'from-rose-50 via-pink-50 to-red-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200',
    isPremium: true
  },
  {
    id: 'midnight',
    name: 'Meia-Noite',
    primary: 'from-slate-600 to-gray-600',
    secondary: 'from-slate-100 to-gray-100',
    accent: 'slate-600',
    background: 'from-slate-50 via-gray-50 to-zinc-50',
    surface: 'white',
    text: 'gray-900',
    textSecondary: 'gray-600',
    border: 'gray-200',
    isPremium: true
  }
];

// Cores para categorização de metas
export const GOAL_COLORS = [
  { id: 'red', name: 'Vermelho', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'orange', name: 'Laranja', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50', borderColor: 'border-orange-200' },
  { id: 'yellow', name: 'Amarelo', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { id: 'green', name: 'Verde', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50', borderColor: 'border-green-200' },
  { id: 'blue', name: 'Azul', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'indigo', name: 'Índigo', color: 'bg-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { id: 'purple', name: 'Roxo', color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'pink', name: 'Rosa', color: 'bg-pink-500', textColor: 'text-pink-700', bgLight: 'bg-pink-50', borderColor: 'border-pink-200' },
  { id: 'gray', name: 'Cinza', color: 'bg-gray-500', textColor: 'text-gray-700', bgLight: 'bg-gray-50', borderColor: 'border-gray-200' },
  { id: 'emerald', name: 'Esmeralda', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'teal', name: 'Azul-petróleo', color: 'bg-teal-500', textColor: 'text-teal-700', bgLight: 'bg-teal-50', borderColor: 'border-teal-200' },
  { id: 'cyan', name: 'Ciano', color: 'bg-cyan-500', textColor: 'text-cyan-700', bgLight: 'bg-cyan-50', borderColor: 'border-cyan-200' },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  availablePalettes: ColorPalette[];
  goalColors: typeof GOAL_COLORS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [colorPalette, setColorPalette] = useState<ColorPalette>(COLOR_PALETTES[0]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Carregar configurações salvas
  useEffect(() => {
    const savedTheme = localStorage.getItem('goggings_theme') as Theme;
    const savedPalette = localStorage.getItem('goggings_palette');

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedPalette) {
      try {
        const palette = JSON.parse(savedPalette);
        const foundPalette = COLOR_PALETTES.find(p => p.id === palette.id);
        if (foundPalette) {
          setColorPalette(foundPalette);
        }
      } catch (error) {
        console.error('Erro ao carregar paleta:', error);
      }
    }
  }, []);

  // Salvar configurações
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('goggings_theme', newTheme);
  };

  const handleSetColorPalette = (palette: ColorPalette) => {
    setColorPalette(palette);
    localStorage.setItem('goggings_palette', JSON.stringify({ id: palette.id }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        colorPalette,
        setColorPalette: handleSetColorPalette,
        availablePalettes: COLOR_PALETTES,
        goalColors: GOAL_COLORS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};