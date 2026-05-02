import { useState, useEffect } from "react";
import { fetchClass } from "@/lib/parse";
import { DEMO_MENU_ITEMS } from "@/lib/demo-data";

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable?: boolean;
  weight?: number;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
  ingredients?: string;
  allergens?: string;
}

interface ParseMenuItem {
  objectId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  weight?: number;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
  ingredients?: string;
  allergens?: string;
}

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      setIsLoading(true);
      try {
        const where = encodeURIComponent(JSON.stringify({ isAvailable: true }));
        const results = await fetchClass<ParseMenuItem>("MenuItem", { where, limit: "100" });
        if (results.length > 0) {
          setMenuItems(results.map((item) => ({ id: item.objectId, ...item })));
        } else {
          setMenuItems(DEMO_MENU_ITEMS);
        }
      } catch {
        setMenuItems(DEMO_MENU_ITEMS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  return { menuItems, isLoading };
}
