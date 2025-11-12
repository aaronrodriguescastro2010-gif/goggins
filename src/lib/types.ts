// Tipos para o sistema Goggings

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  coins: number; // Moedas ganhas ao completar
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  targetTasks: number;
  completedTasks: number;
  dailyTasks: DailyTask[];
  startDate: Date;
  endDate: Date;
  completed: boolean;
  coins: number; // Moedas ganhas ao completar a meta
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold';
  coins: number;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: {
    type: 'streak' | 'goals_completed' | 'tasks_completed' | 'weeks_planned';
    target: number;
  };
}

export interface UserStats {
  totalCoins: number;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalGoalsCompleted: number;
  weeksPlanned: number;
  level: number;
  xp: number;
}

export interface Avatar {
  id: string;
  hair: string;
  outfit: string;
  accessory: string;
  background: string;
  animation: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'hair' | 'outfit' | 'accessory' | 'background' | 'animation';
  price: number;
  isPremium: boolean;
  owned: boolean;
  preview: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  stats: UserStats;
  avatar: Avatar;
  achievements: Achievement[];
  currentWeeklyGoal?: WeeklyGoal;
  weeklyGoals: WeeklyGoal[];
}