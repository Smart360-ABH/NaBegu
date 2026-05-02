import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Home, Menu as MenuIcon, ShoppingBag, User } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const navItems = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/menu", label: "Меню", icon: MenuIcon },
    { href: "/order", label: "Корзина", icon: ShoppingBag, badge: totalItems },
    { href: user ? "/profile" : "/login", label: "Кабинет", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href === "/menu" && location.startsWith("/menu"));
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <div className="relative">
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-primary-foreground bg-primary rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
