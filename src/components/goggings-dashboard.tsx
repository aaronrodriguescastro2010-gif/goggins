// Componente principal do dashboard Goggings

"use client";

import { useState } from "react";
import { useGoggings } from "@/hooks/useGoggings";
import { useTheme } from "@/contexts/theme-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircularProgress } from "@/components/ui/circular-progress";
import { StatsCard } from "@/components/ui/stats-card";
import { ProStore } from "@/components/pro-store";
import { AvatarDisplay } from "@/components/avatar-display";
import { DailyView } from "@/components/daily-view";
import { ThemeSettings } from "@/components/theme-settings";
import { 
  Plus, 
  Check, 
  Trophy, 
  Star, 
  Target,
  Calendar,
  Coins,
  Crown,
  Settings,
  Share2,
  ShoppingBag,
  User,
  Palette,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";

export const GoggingsDashboard = () => {
  const { 
    user, 
    weekProgress, 
    createWeeklyGoal, 
    addDailyTask, 
    completeTask,
    buyStoreItem,
    upgradeToPro,
    unlockedAchievements,
    recentAchievements
  } = useGoggings();

  const { colorPalette } = useTheme();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState(7);
  const [newGoalDifficulty, setNewGoalDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim()) return;
    
    createWeeklyGoal(newGoalTitle, newGoalDescription, newGoalTarget, newGoalDifficulty);
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalTarget(7);
    setNewGoalDifficulty('medium');
    setShowNewGoal(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    addDailyTask(newTaskTitle);
    setNewTaskTitle("");
    setShowNewTask(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getAchievementColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20",
      `from-${colorPalette.background.split(' ')[0].replace('from-', '')} ${colorPalette.background.split(' ').slice(1).join(' ')}`
    )}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r", colorPalette.primary)}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={cn("text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent", colorPalette.primary)}>
                  Goggings
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Olá, {user.name}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user.isPro && (
                <AvatarDisplay avatar={user.avatar} isPro={user.isPro} size="sm" />
              )}
              {!user.isPro && (
                <Button 
                  onClick={upgradeToPro}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  size="sm"
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Pro
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Diário</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Conquistas</span>
            </TabsTrigger>
            <TabsTrigger value="avatar" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Avatar</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Loja</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Temas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Card */}
            <StatsCard stats={user.stats} />

            {/* Meta Semanal */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Calendar className={cn("w-5 h-5", `text-${colorPalette.accent}`)} />
                  Meta Semanal
                </h2>
                {!user.currentWeeklyGoal && (
                  <Button 
                    onClick={() => setShowNewGoal(true)}
                    className={cn("bg-gradient-to-r hover:from-purple-600 hover:to-blue-600", colorPalette.primary)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nova Meta
                  </Button>
                )}
              </div>

              {user.currentWeeklyGoal ? (
                <div className="space-y-4">
                  {/* Progresso da Meta */}
                  <div className="flex items-center gap-6">
                    <CircularProgress 
                      progress={weekProgress}
                      size={100}
                      className={`text-${colorPalette.accent}`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {weekProgress}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          completo
                        </div>
                      </div>
                    </CircularProgress>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {user.currentWeeklyGoal.title}
                        </h3>
                        <Badge className={getDifficultyColor(user.currentWeeklyGoal.difficulty)}>
                          {user.currentWeeklyGoal.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {user.currentWeeklyGoal.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {user.currentWeeklyGoal.completedTasks} / {user.currentWeeklyGoal.targetTasks} tarefas
                        </span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <Coins className="w-3 h-3 mr-1" />
                          {user.currentWeeklyGoal.coins} moedas
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Tarefas Diárias */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        Tarefas Diárias
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowNewTask(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {user.currentWeeklyGoal.dailyTasks.map((task) => (
                        <div 
                          key={task.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all",
                            task.completed 
                              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700" 
                              : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-6 h-6 p-0 rounded-full border-2",
                              task.completed
                                ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                                : `border-gray-300 dark:border-gray-600 hover:border-${colorPalette.accent}`
                            )}
                            onClick={() => !task.completed && completeTask(task.id)}
                            disabled={task.completed}
                          >
                            {task.completed && <Check className="w-3 h-3" />}
                          </Button>
                          
                          <span className={cn(
                            "flex-1",
                            task.completed 
                              ? "line-through text-gray-500 dark:text-gray-400" 
                              : "text-gray-900 dark:text-gray-100"
                          )}>
                            {task.title}
                          </span>
                          
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                            <Coins className="w-3 h-3 mr-1" />
                            {task.coins}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Nenhuma meta definida
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Crie sua primeira meta semanal para começar!
                  </p>
                  <Button 
                    onClick={() => setShowNewGoal(true)}
                    className={cn("bg-gradient-to-r hover:from-purple-600 hover:to-blue-600", colorPalette.primary)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Criar Meta
                  </Button>
                </div>
              )}
            </Card>

            {/* Conquistas Recentes */}
            {recentAchievements.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Conquistas Recentes
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recentAchievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700"
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                            {achievement.title}
                          </h4>
                          <Badge className={getAchievementColor(achievement.level)} size="sm">
                            {achievement.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {achievement.description}
                        </p>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <Coins className="w-3 h-3 mr-1" />
                          {achievement.coins}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <DailyView 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Star className={cn("w-5 h-5", `text-${colorPalette.accent}`)} />
                  Conquistas ({unlockedAchievements.length}/{user.achievements.length})
                </h2>
                {user.isPro && (
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartilhar
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {user.achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={cn(
                      "text-center p-4 rounded-lg border transition-all",
                      achievement.unlocked
                        ? "bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50"
                    )}
                  >
                    <div className="text-3xl mb-2">
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <Badge className={getAchievementColor(achievement.level)} size="sm">
                      {achievement.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="avatar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                  <User className={cn("w-5 h-5", `text-${colorPalette.accent}`)} />
                  Seu Avatar
                </h2>
                <AvatarDisplay 
                  avatar={user.avatar} 
                  isPro={user.isPro} 
                  size="lg" 
                  showDetails={true}
                />
              </Card>
              
              {user.isPro && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Funcionalidades Pro
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Avatar Personalizado</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Customize com itens da loja</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Widgets Exclusivos</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Para sua tela inicial</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Compartilhamento</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Conquistas em redes sociais</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            <ProStore 
              userCoins={user.stats.totalCoins}
              isPro={user.isPro}
              onBuyItem={buyStoreItem}
              onUpgradeToPro={upgradeToPro}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ThemeSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nova Meta */}
      {showNewGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Nova Meta Semanal
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título da Meta
                </label>
                <Input
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Ex: Exercitar-se todos os dias"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição (opcional)
                </label>
                <Input
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  placeholder="Descreva sua meta..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Tarefas
                </label>
                <Input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 1)}
                  min="1"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dificuldade
                </label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={newGoalDifficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewGoalDifficulty(difficulty)}
                      className={cn(
                        newGoalDifficulty === difficulty && difficulty === 'easy' && "bg-green-500 hover:bg-green-600",
                        newGoalDifficulty === difficulty && difficulty === 'medium' && "bg-yellow-500 hover:bg-yellow-600",
                        newGoalDifficulty === difficulty && difficulty === 'hard' && "bg-red-500 hover:bg-red-600"
                      )}
                    >
                      {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowNewGoal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateGoal}
                className={cn("flex-1 bg-gradient-to-r hover:from-purple-600 hover:to-blue-600", colorPalette.primary)}
                disabled={!newGoalTitle.trim()}
              >
                Criar Meta
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Nova Tarefa */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Nova Tarefa Diária
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título da Tarefa
                </label>
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ex: Fazer 30 minutos de exercício"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowNewTask(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddTask}
                className={cn("flex-1 bg-gradient-to-r hover:from-purple-600 hover:to-blue-600", colorPalette.primary)}
                disabled={!newTaskTitle.trim()}
              >
                Adicionar Tarefa
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};