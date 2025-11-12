"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGoggings } from '@/hooks/useGoggings';
import { useTheme } from '@/contexts/theme-context';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Check,
  Plus,
  Filter,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailyViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DailyView = ({ selectedDate, onDateChange }: DailyViewProps) => {
  const { user, completeTask } = useGoggings();
  const { goalColors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterColor, setFilterColor] = useState<string | null>(null);

  // Obter tarefas do dia selecionado
  const getDailyTasks = () => {
    if (!user.currentWeeklyGoal) return [];
    
    // Para este exemplo, vamos simular tarefas distribuídas ao longo da semana
    // Em uma implementação real, as tarefas teriam datas específicas
    const dayOfWeek = selectedDate.getDay();
    const tasksPerDay = Math.ceil(user.currentWeeklyGoal.dailyTasks.length / 7);
    const startIndex = dayOfWeek * tasksPerDay;
    const endIndex = Math.min(startIndex + tasksPerDay, user.currentWeeklyGoal.dailyTasks.length);
    
    return user.currentWeeklyGoal.dailyTasks.slice(startIndex, endIndex).map(task => ({
      ...task,
      goalColor: goalColors[Math.floor(Math.random() * goalColors.length)], // Cor aleatória para demo
      goalTitle: user.currentWeeklyGoal!.title
    }));
  };

  const dailyTasks = getDailyTasks();
  const filteredTasks = filterColor 
    ? dailyTasks.filter(task => task.goalColor.id === filterColor)
    : dailyTasks;

  // Navegação de datas
  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Calendário do mês
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousDay}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {format(selectedDate, "EEEE", { locale: ptBR })}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextDay}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {!isToday(selectedDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Hoje
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <CalendarIcon className="w-4 h-4 mr-1" />
              Calendário
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendário do mês (expansível) */}
      {showDatePicker && (
        <Card className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
              {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(day => (
              <Button
                key={day.toISOString()}
                variant={isSameDay(day, selectedDate) ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-10 p-0",
                  isToday(day) && !isSameDay(day, selectedDate) && "ring-2 ring-blue-500 ring-offset-2"
                )}
                onClick={() => {
                  onDateChange(day);
                  setShowDatePicker(false);
                }}
              >
                {format(day, 'd')}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Filtros por cor */}
      {dailyTasks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por categoria:
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterColor === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterColor(null)}
            >
              Todas
            </Button>
            
            {Array.from(new Set(dailyTasks.map(task => task.goalColor.id))).map(colorId => {
              const color = goalColors.find(c => c.id === colorId);
              if (!color) return null;
              
              return (
                <Button
                  key={colorId}
                  variant={filterColor === colorId ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterColor(colorId)}
                  className="flex items-center gap-2"
                >
                  <div className={cn("w-3 h-3 rounded-full", color.color)} />
                  {color.name}
                </Button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Lista de tarefas do dia */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Tarefas do Dia ({filteredTasks.length})
          </h3>
          
          {filteredTasks.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredTasks.filter(t => t.completed).length} de {filteredTasks.length} concluídas
            </div>
          )}
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filterColor ? 'Nenhuma tarefa desta categoria' : 'Nenhuma tarefa para hoje'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filterColor 
                ? 'Tente remover o filtro ou selecionar outra categoria.'
                : 'Que tal planejar algumas atividades para este dia?'
              }
            </p>
            {!filterColor && (
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Tarefa
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-all",
                  task.completed
                    ? cn(task.goalColor.bgLight, task.goalColor.borderColor, "border")
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {/* Indicador de cor da categoria */}
                <div className={cn("w-4 h-4 rounded-full flex-shrink-0", task.goalColor.color)} />
                
                {/* Checkbox de conclusão */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-6 h-6 p-0 rounded-full border-2 flex-shrink-0",
                    task.completed
                      ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
                  )}
                  onClick={() => !task.completed && handleCompleteTask(task.id)}
                  disabled={task.completed}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </Button>
                
                {/* Conteúdo da tarefa */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      "font-medium",
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-900 dark:text-gray-100"
                    )}>
                      {task.title}
                    </h4>
                    
                    <Badge 
                      variant="secondary" 
                      className={cn(task.goalColor.textColor, task.goalColor.bgLight)}
                    >
                      {task.goalTitle}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Categoria: {task.goalColor.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      <span>{task.coins} moedas</span>
                    </div>
                  </div>
                </div>
                
                {/* Status visual */}
                {task.completed && (
                  <div className="flex-shrink-0">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Concluída
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Resumo do dia */}
      {filteredTasks.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {filteredTasks.filter(t => t.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Concluídas
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {filteredTasks.filter(t => !t.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pendentes
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {filteredTasks.filter(t => t.completed).reduce((sum, t) => sum + t.coins, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Moedas Ganhas
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Progresso
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};