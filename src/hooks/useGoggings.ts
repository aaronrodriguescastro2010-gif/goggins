// Hook personalizado para gerenciar o estado do Goggings

import { useState, useEffect, useCallback } from 'react';
import { User, WeeklyGoal, DailyTask, Achievement, UserStats } from '@/lib/types';
import { MOCK_USER, ACHIEVEMENTS, getWeekStart, getWeekEnd, calculateProgress } from '@/lib/data';

export const useGoggings = () => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

  // Carregar dados do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('goggings_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Converter strings de data de volta para Date objects
        if (parsedUser.weeklyGoals) {
          parsedUser.weeklyGoals = parsedUser.weeklyGoals.map((goal: any) => ({
            ...goal,
            startDate: new Date(goal.startDate),
            endDate: new Date(goal.endDate),
            dailyTasks: goal.dailyTasks.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              completedAt: task.completedAt ? new Date(task.completedAt) : undefined
            }))
          }));
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  const saveUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('goggings_user', JSON.stringify(updatedUser));
  }, []);

  // Criar nova meta semanal
  const createWeeklyGoal = useCallback((title: string, description: string, targetTasks: number, difficulty: 'easy' | 'medium' | 'hard') => {
    const newGoal: WeeklyGoal = {
      id: `goal_${Date.now()}`,
      title,
      description,
      targetTasks,
      completedTasks: 0,
      dailyTasks: [],
      startDate: getWeekStart(currentWeek),
      endDate: getWeekEnd(currentWeek),
      completed: false,
      coins: difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200,
      difficulty
    };

    const updatedUser = {
      ...user,
      currentWeeklyGoal: newGoal,
      weeklyGoals: [...user.weeklyGoals, newGoal],
      stats: {
        ...user.stats,
        weeksPlanned: user.stats.weeksPlanned + 1
      }
    };

    saveUser(updatedUser);
    checkAchievements(updatedUser);
  }, [user, currentWeek, saveUser]);

  // Adicionar tarefa diária
  const addDailyTask = useCallback((title: string) => {
    if (!user.currentWeeklyGoal) return;

    const newTask: DailyTask = {
      id: `task_${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date(),
      coins: 10
    };

    const updatedGoal = {
      ...user.currentWeeklyGoal,
      dailyTasks: [...user.currentWeeklyGoal.dailyTasks, newTask]
    };

    const updatedUser = {
      ...user,
      currentWeeklyGoal: updatedGoal,
      weeklyGoals: user.weeklyGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    };

    saveUser(updatedUser);
  }, [user, saveUser]);

  // Completar tarefa diária
  const completeTask = useCallback((taskId: string) => {
    if (!user.currentWeeklyGoal) return;

    const task = user.currentWeeklyGoal.dailyTasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    const updatedTasks = user.currentWeeklyGoal.dailyTasks.map(t =>
      t.id === taskId 
        ? { ...t, completed: true, completedAt: new Date() }
        : t
    );

    const completedTasksCount = updatedTasks.filter(t => t.completed).length;
    const goalCompleted = completedTasksCount >= user.currentWeeklyGoal.targetTasks;

    const updatedGoal = {
      ...user.currentWeeklyGoal,
      dailyTasks: updatedTasks,
      completedTasks: completedTasksCount,
      completed: goalCompleted
    };

    // Calcular moedas ganhas
    let coinsEarned = task.coins;
    if (goalCompleted && !user.currentWeeklyGoal.completed) {
      coinsEarned += user.currentWeeklyGoal.coins;
    }

    // Atualizar streak
    const today = new Date().toDateString();
    const lastTaskDate = user.weeklyGoals
      .flatMap(g => g.dailyTasks)
      .filter(t => t.completed && t.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0]?.completedAt;

    let newStreak = user.stats.currentStreak;
    if (!lastTaskDate || new Date(lastTaskDate).toDateString() !== today) {
      newStreak += 1;
    }

    const updatedStats: UserStats = {
      ...user.stats,
      totalCoins: user.stats.totalCoins + coinsEarned,
      totalTasksCompleted: user.stats.totalTasksCompleted + 1,
      totalGoalsCompleted: goalCompleted && !user.currentWeeklyGoal.completed 
        ? user.stats.totalGoalsCompleted + 1 
        : user.stats.totalGoalsCompleted,
      currentStreak: newStreak,
      longestStreak: Math.max(user.stats.longestStreak, newStreak),
      xp: user.stats.xp + (task.coins * 2),
      level: Math.floor((user.stats.xp + (task.coins * 2)) / 100) + 1
    };

    const updatedUser = {
      ...user,
      currentWeeklyGoal: updatedGoal,
      weeklyGoals: user.weeklyGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      ),
      stats: updatedStats
    };

    saveUser(updatedUser);
    checkAchievements(updatedUser);
  }, [user, saveUser]);

  // Verificar conquistas
  const checkAchievements = useCallback((updatedUser: User) => {
    const newAchievements = updatedUser.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;
      const { type, target } = achievement.requirement;

      switch (type) {
        case 'tasks_completed':
          shouldUnlock = updatedUser.stats.totalTasksCompleted >= target;
          break;
        case 'goals_completed':
          shouldUnlock = updatedUser.stats.totalGoalsCompleted >= target;
          break;
        case 'streak':
          shouldUnlock = updatedUser.stats.currentStreak >= target;
          break;
        case 'weeks_planned':
          shouldUnlock = updatedUser.stats.weeksPlanned >= target;
          break;
      }

      if (shouldUnlock) {
        // Adicionar moedas da conquista
        updatedUser.stats.totalCoins += achievement.coins;
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date()
        };
      }

      return achievement;
    });

    if (JSON.stringify(newAchievements) !== JSON.stringify(updatedUser.achievements)) {
      const finalUser = {
        ...updatedUser,
        achievements: newAchievements
      };
      saveUser(finalUser);
    }
  }, [saveUser]);

  // Comprar item da loja
  const buyStoreItem = useCallback((itemId: string, price: number) => {
    if (user.stats.totalCoins < price) return false;

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        totalCoins: user.stats.totalCoins - price
      }
    };

    saveUser(updatedUser);
    return true;
  }, [user, saveUser]);

  // Upgrade para Pro
  const upgradeToPro = useCallback(() => {
    const updatedUser = {
      ...user,
      isPro: true
    };
    saveUser(updatedUser);
  }, [user, saveUser]);

  return {
    user,
    currentWeek,
    setCurrentWeek,
    createWeeklyGoal,
    addDailyTask,
    completeTask,
    buyStoreItem,
    upgradeToPro,
    // Computed values
    weekProgress: user.currentWeeklyGoal 
      ? calculateProgress(user.currentWeeklyGoal.completedTasks, user.currentWeeklyGoal.targetTasks)
      : 0,
    unlockedAchievements: user.achievements.filter(a => a.unlocked),
    recentAchievements: user.achievements
      .filter(a => a.unlocked && a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 3)
  };
};