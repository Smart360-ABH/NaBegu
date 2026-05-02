import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu, MenuItemType } from "@/hooks/use-menu";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

function getFallbackImageByCategory(category: string): string {
  const normalized = category.toLowerCase();
  if (normalized.includes("бургер")) return "/assets/images/burger.png";
  if (normalized.includes("напит")) return "/assets/images/drinks.png";
  if (normalized.includes("десерт")) return "/assets/images/desserts.png";
  return "/assets/images/hot-dishes.png";
}

function resolveMenuImage(item: MenuItemType): string {
  if (!item.imageUrl) return getFallbackImageByCategory(item.category);
  const src = item.imageUrl.toLowerCase();
  const fallback = getFallbackImageByCategory(item.category);

  // If the backend returned a generic local asset that conflicts with category, keep UI consistent.
  if (src.includes("/assets/images/")) {
    if (item.category.toLowerCase().includes("бургер") && !src.includes("burger")) return fallback;
    if (item.category.toLowerCase().includes("напит") && !src.includes("drinks")) return fallback;
    if (item.category.toLowerCase().includes("десерт") && !src.includes("desserts")) return fallback;
  }

  return item.imageUrl;
}

function FlipCard({ item, onAdd }: { item: MenuItemType; onAdd: (item: MenuItemType) => void }) {
  const [flipped, setFlipped] = useState(false);
  const imageSrc = resolveMenuImage(item);

  return (
    <div
      className="group relative w-full"
      style={{ perspective: "1000px", minHeight: "360px" }}
      data-testid={`card-menu-${item.id}`}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d", minHeight: "360px" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden bg-card border shadow-sm hover:shadow-md transition-shadow flex flex-col"
          style={{ backfaceVisibility: "hidden", pointerEvents: flipped ? "none" : "auto" }}
        >
          <div className="cursor-pointer flex flex-col flex-1 min-h-0" onClick={() => setFlipped(true)}>
            <div className="relative aspect-[4/3] overflow-hidden bg-muted flex-shrink-0">
              <img
                src={imageSrc}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            <div className="p-3 min-h-[84px] flex items-start">
              <h3 className="text-xl md:text-xl leading-tight font-bold line-clamp-2 break-words">
                {item.name}
              </h3>
            </div>
          </div>

          <div className="p-3 border-t mt-auto flex-shrink-0 flex items-center justify-between gap-2">
            <span className="text-2xl font-bold leading-none text-primary whitespace-nowrap">{item.price} ₽</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full px-3 text-xs"
                onClick={() => setFlipped(true)}
                data-testid={`button-details-${item.id}`}
              >
                Состав
              </Button>
              <Button
                size="sm"
                className="rounded-full px-4"
                onClick={() => onAdd(item)}
                data-testid={`button-add-cart-${item.id}`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-3xl overflow-hidden bg-card border shadow-sm flex flex-col cursor-pointer"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", pointerEvents: flipped ? "auto" : "none" }}
          onClick={() => setFlipped(false)}
        >
          <div className="bg-primary/10 px-5 pt-5 pb-4 flex-shrink-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold leading-tight">{item.name}</h3>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
                data-testid={`button-flip-back-${item.id}`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            {item.weight && <p className="text-sm text-muted-foreground mt-1">Вес: {item.weight} г</p>}
          </div>

          <div className="flex-1 p-5 flex flex-col gap-4 overflow-auto">
            {item.calories !== undefined && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Пищевая ценность на 100 г
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Калории", value: `${item.calories} кк` },
                    { label: "Белки", value: `${item.proteins}г` },
                    { label: "Жиры", value: `${item.fats}г` },
                    { label: "Углеводы", value: `${item.carbs}г` },
                  ].map((n) => (
                    <div key={n.label} className="bg-muted rounded-xl p-2 text-center">
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
          </div>

          <div className="p-4 border-t flex items-center justify-between flex-shrink-0">
            <span className="text-2xl font-bold text-primary">{item.price} ₽</span>
            <Button
              className="rounded-full px-6"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item);
                setFlipped(false);
              }}
              data-testid={`button-add-cart-back-${item.id}`}
            >
              <Plus className="w-4 h-4 mr-1" />
              В корзину
            </Button>
          </div>
        </div>
      </motion.div>
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
          Нажмите на карточку, чтобы увидеть состав, вес и пищевую ценность.
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
                  <FlipCard item={item} onAdd={handleAdd} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}
