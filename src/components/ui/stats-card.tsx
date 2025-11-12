// Componente de estatísticas do usuário

import { UserStats } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Flame, Trophy, Target } from "lucide-react";

interface StatsCardProps {
  stats: UserStats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  const xpForNext = stats.level * 100;
  const xpProgress = (stats.xp % 100);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">L{stats.level}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Nível {stats.level}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.xp} / {xpForNext} XP
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Coins className="w-3 h-3 mr-1" />
          {stats.totalCoins}
        </Badge>
      </div>

      {/* Barra de XP */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${xpProgress}%` }}
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Flame className="w-4 h-4 text-orange-500 mr-1" />
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {stats.currentStreak}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Sequência</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-green-500 mr-1" />
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {stats.totalTasksCompleted}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Tarefas</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {stats.totalGoalsCompleted}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Metas</p>
        </div>
      </div>
    </Card>
  );
};