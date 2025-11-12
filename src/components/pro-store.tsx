// Componente da loja premium do Goggings

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STORE_ITEMS } from "@/lib/data";
import { StoreItem } from "@/lib/types";
import { Coins, Crown, Lock, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProStoreProps {
  userCoins: number;
  isPro: boolean;
  onBuyItem: (itemId: string, price: number) => boolean;
  onUpgradeToPro: () => void;
}

export const ProStore = ({ userCoins, isPro, onBuyItem, onUpgradeToPro }: ProStoreProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("hair");

  const categories = [
    { id: "hair", name: "Cabelos", icon: "💇" },
    { id: "outfit", name: "Roupas", icon: "👕" },
    { id: "accessory", name: "Acessórios", icon: "🎩" },
    { id: "background", name: "Fundos", icon: "🌟" },
  ];

  const getItemsByCategory = (category: string): StoreItem[] => {
    return STORE_ITEMS.filter(item => item.category === category);
  };

  const handleBuyItem = (item: StoreItem) => {
    if (!isPro && item.isPremium) {
      onUpgradeToPro();
      return;
    }
    
    if (userCoins >= item.price && !item.owned) {
      const success = onBuyItem(item.id, item.price);
      if (success) {
        // Atualizar item como comprado (isso seria feito no hook useGoggings)
        console.log(`Item ${item.name} comprado!`);
      }
    }
  };

  if (!isPro) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Goggings Pro
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Desbloqueie a loja de personalização, avatares interativos e widgets exclusivos!
        </p>
        <Button 
          onClick={onUpgradeToPro}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade para Pro
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Loja Pro
          </h2>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Crown className="w-3 h-3 mr-1" />
            Exclusivo
          </Badge>
        </div>
        
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Coins className="w-4 h-4 mr-1" />
          {userCoins} moedas
        </Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              <span className="text-sm">{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {getItemsByCategory(category.id).map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative p-4 rounded-lg border transition-all",
                    item.owned
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"
                      : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                  )}
                >
                  {item.isPremium && !isPro && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-3xl mb-2">{item.preview}</div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Coins className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.price}
                      </span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={item.owned ? "secondary" : "default"}
                      className={cn(
                        "w-full",
                        !item.owned && userCoins >= item.price && "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600",
                        !item.owned && userCoins < item.price && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleBuyItem(item)}
                      disabled={item.owned || (!isPro && item.isPremium) || (userCoins < item.price)}
                    >
                      {item.owned ? "Comprado" : 
                       !isPro && item.isPremium ? "Pro Apenas" :
                       userCoins < item.price ? "Sem moedas" : "Comprar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};