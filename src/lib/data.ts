// Dados mock e utilitários para o Goggings

import { Achievement, UserStats, User, WeeklyGoal, DailyTask, Avatar, StoreItem } from './types';

// Conquistas disponíveis
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_task',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira tarefa',
    icon: '🎯',
    level: 'bronze',
    coins: 10,
    unlocked: false,
    requirement: { type: 'tasks_completed', target: 1 }
  },
  {
    id: 'week_warrior',
    title: 'Guerreiro Semanal',
    description: 'Complete uma meta semanal',
    icon: '⚔️',
    level: 'bronze',
    coins: 50,
    unlocked: false,
    requirement: { type: 'goals_completed', target: 1 }
  },
  {
    id: 'streak_7',
    title: '7 Dias Seguidos',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '🔥',
    level: 'silver',
    coins: 100,
    unlocked: false,
    requirement: { type: 'streak', target: 7 }
  },
  {
    id: 'planning_master',
    title: 'Mestre em Planejamento',
    description: 'Planeje 4 semanas seguidas',
    icon: '📋',
    level: 'gold',
    coins: 200,
    unlocked: false,
    requirement: { type: 'weeks_planned', target: 4 }
  },
  {
    id: 'impossible_goal',
    title: 'Meta Impossível',
    description: 'Complete uma meta de alta dificuldade',
    icon: '🏆',
    level: 'gold',
    coins: 300,
    unlocked: false,
    requirement: { type: 'goals_completed', target: 1 }
  },
  {
    id: 'streak_30',
    title: 'Lenda da Consistência',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '👑',
    level: 'gold',
    coins: 500,
    unlocked: false,
    requirement: { type: 'streak', target: 30 }
  }
];

// Itens da loja
export const STORE_ITEMS: StoreItem[] = [
  // Cabelos
  { id: 'hair_1', name: 'Cabelo Clássico', category: 'hair', price: 50, isPremium: false, owned: true, preview: '👨' },
  { id: 'hair_2', name: 'Cabelo Moderno', category: 'hair', price: 100, isPremium: true, owned: false, preview: '👨‍🦱' },
  { id: 'hair_3', name: 'Cabelo Rebelde', category: 'hair', price: 150, isPremium: true, owned: false, preview: '👨‍🦰' },
  
  // Roupas
  { id: 'outfit_1', name: 'Casual', category: 'outfit', price: 0, isPremium: false, owned: true, preview: '👕' },
  { id: 'outfit_2', name: 'Executivo', category: 'outfit', price: 200, isPremium: true, owned: false, preview: '👔' },
  { id: 'outfit_3', name: 'Esportivo', category: 'outfit', price: 150, isPremium: true, owned: false, preview: '🏃' },
  
  // Acessórios
  { id: 'acc_1', name: 'Óculos', category: 'accessory', price: 75, isPremium: true, owned: false, preview: '🤓' },
  { id: 'acc_2', name: 'Chapéu', category: 'accessory', price: 100, isPremium: true, owned: false, preview: '🎩' },
  
  // Fundos
  { id: 'bg_1', name: 'Padrão', category: 'background', price: 0, isPremium: false, owned: true, preview: '🌟' },
  { id: 'bg_2', name: 'Espaço', category: 'background', price: 300, isPremium: true, owned: false, preview: '🌌' },
  { id: 'bg_3', name: 'Natureza', category: 'background', price: 250, isPremium: true, owned: false, preview: '🌲' }
];

// Avatar padrão
export const DEFAULT_AVATAR: Avatar = {
  id: 'default',
  hair: 'hair_1',
  outfit: 'outfit_1',
  accessory: '',
  background: 'bg_1',
  animation: 'idle'
};

// Stats iniciais do usuário
export const INITIAL_STATS: UserStats = {
  totalCoins: 100, // Começar com algumas moedas
  currentStreak: 0,
  longestStreak: 0,
  totalTasksCompleted: 0,
  totalGoalsCompleted: 0,
  weeksPlanned: 0,
  level: 1,
  xp: 0
};

// Usuário mock
export const MOCK_USER: User = {
  id: 'user_1',
  name: 'Usuário Goggings',
  email: 'user@goggings.com',
  isPro: false, // Começar como free user
  stats: INITIAL_STATS,
  avatar: DEFAULT_AVATAR,
  achievements: ACHIEVEMENTS,
  weeklyGoals: []
};

// Utilitários
export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Segunda-feira
  return new Date(d.setDate(diff));
};

export const getWeekEnd = (date: Date = new Date()): Date => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
};

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getLevelFromXP = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = getLevelFromXP(currentXP);
  return currentLevel * 100;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getDaysOfWeek = (): string[] => {
  return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
};