// Componente do Avatar interativo

"use client";

import { Avatar, StoreItem } from "@/lib/types";
import { STORE_ITEMS } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarDisplayProps {
  avatar: Avatar;
  isPro: boolean;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  animated?: boolean;
}

export const AvatarDisplay = ({ 
  avatar, 
  isPro, 
  size = "md", 
  showDetails = false,
  animated = true 
}: AvatarDisplayProps) => {
  const getItemById = (itemId: string): StoreItem | undefined => {
    return STORE_ITEMS.find(item => item.id === itemId);
  };

  const hairItem = getItemById(avatar.hair);
  const outfitItem = getItemById(avatar.outfit);
  const accessoryItem = getItemById(avatar.accessory);
  const backgroundItem = getItemById(avatar.background);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const textSizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl"
  };

  if (!isPro) {
    return (
      <Card className={cn("p-4 flex items-center justify-center", sizeClasses[size])}>
        <User className="w-8 h-8 text-gray-400" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Avatar Display */}
      <Card className={cn(
        "relative p-4 flex items-center justify-center overflow-hidden",
        sizeClasses[size],
        animated && "transition-all duration-300 hover:scale-105"
      )}>
        {/* Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: backgroundItem?.id === 'bg_2' 
              ? 'linear-gradient(45deg, #1e3a8a, #7c3aed)' 
              : backgroundItem?.id === 'bg_3'
              ? 'linear-gradient(45deg, #059669, #10b981)'
              : 'linear-gradient(45deg, #6366f1, #8b5cf6)'
          }}
        />
        
        {/* Avatar Elements */}
        <div className="relative z-10 text-center">
          {/* Main Avatar */}
          <div className={cn("mb-1", textSizes[size])}>
            {hairItem?.preview || '👨'}
          </div>
          
          {/* Outfit overlay */}
          {outfitItem && outfitItem.id !== 'outfit_1' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg opacity-80">
              {outfitItem.preview}
            </div>
          )}
          
          {/* Accessory overlay */}
          {accessoryItem && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-sm">
              {accessoryItem.preview}
            </div>
          )}
        </div>
        
        {/* Pro Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
            <Sparkles className="w-2 h-2 mr-1" />
            Pro
          </Badge>
        </div>
      </Card>

      {/* Avatar Details */}
      {showDetails && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Seu Avatar
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Cabelo:</span>
              <span className="ml-1 font-medium">{hairItem?.name || 'Padrão'}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Roupa:</span>
              <span className="ml-1 font-medium">{outfitItem?.name || 'Casual'}</span>
            </div>
            {accessoryItem && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Acessório:</span>
                <span className="ml-1 font-medium">{accessoryItem.name}</span>
              </div>
            )}
            <div>
              <span className="text-gray-600 dark:text-gray-400">Fundo:</span>
              <span className="ml-1 font-medium">{backgroundItem?.name || 'Padrão'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};