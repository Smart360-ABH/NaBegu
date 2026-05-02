import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu, MenuItemType } from "@/hooks/use-menu";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

function MenuItemDialog({ item, onAdd }: { item: MenuItemType; onAdd: (item: MenuItemType) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="group rounded-3xl overflow-hidden bg-card border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer"
          data-testid={`card-menu-${item.id}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              {item.category}
            </span>
          </div>
          <div className="px-5 pt-5 pb-3 flex flex-col gap-2">
            <h3 className="text-xl font-bold leading-tight">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            {item.weight && (
              <p className="text-xs text-muted-foreground">{item.weight} г · {item.calories} ккал</p>
            )}
          </div>
          <div className="px-5 pb-5 pt-3 border-t mt-auto flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{item.price} ₽</span>
            <Button
              size="sm"
              className="rounded-full px-4"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item);
              }}
              data-testid={`button-add-cart-${item.id}`}
            >
              <Plus className="w-4 h-4 mr-1" />
              В корзину
            </Button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-muted">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        <div className="p-6 pt-5 space-y-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl">{item.name}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          {item.weight && (
            <p className="text-sm text-muted-foreground">
              Вес: {item.weight} г{item.calories !== undefined ? ` · ${item.calories} ккал` : ""}
            </p>
          )}

          {item.calories !== undefined && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Пищевая ценность на 100 г
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Калории", value: `${item.calories} кк` },
                  { label: "Белки", value: `${item.proteins}г` },
                  { label: "Жиры", value: `${item.fats}г` },
                  { label: "Углеводы", value: `${item.carbs}г` },
                ].map((n) => (
                  <div key={n.label} className="bg-muted rounded-xl p-3 text-center">
                    <p className="text-sm font-bold">{n.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{n.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.ingredients && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Состав
              </p>
              <p className="text-sm leading-relaxed">{item.ingredients}</p>
            </div>
          )}

          {item.allergens && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Аллергены
              </p>
              <p className="text-sm">{item.allergens}</p>
            </div>
          )}

          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{item.price} ₽</span>
            <Button
              className="rounded-full px-6"
              onClick={() => onAdd(item)}
              data-testid={`button-add-cart-dialog-${item.id}`}
            >
              <Plus className="w-4 h-4 mr-1" />
              В корзину
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MenuCard({ item, onAdd }: { item: MenuItemType; onAdd: (item: MenuItemType) => void }) {
  return (
    <div className="h-full">
      <MenuItemDialog item={item} onAdd={onAdd} />
    </div>
  );
}

export default function Menu() {
  const { menuItems, isLoading } = useMenu();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("Все");

  const categories = ["Все", ...Array.from(new Set(menuItems.map((item) => item.category)))];
  const filteredItems =
    activeCategory === "Все"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleAdd = (item: MenuItemType) => {
    addItem({ id: item.id, name: item.name, price: item.price });
    toast.success(`Добавлено: ${item.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Наше Меню</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Нажмите на карточку, чтобы открыть подробности блюда.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 mb-12" data-testid="category-filters">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)
          : categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveCategory(cat)}
                data-testid={`button-category-${cat}`}
              >
                {cat}
              </Button>
            ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-full mt-2" />
              </div>
            ))
          : (
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuCard item={item} onAdd={handleAdd} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}
