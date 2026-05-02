import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/lib/auth-api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User, ShoppingBag, Clock } from "lucide-react";

interface OrderRecord {
  objectId: string;
  customerName: string;
  customerPhone: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  status: string;
  createdAt: string;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [user, isLoading, setLocation]);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    getUserOrders(user.objectId, user.sessionToken)
      .then((res) => setOrders(res as OrderRecord[]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const statusLabel: Record<string, string> = {
    new: "Новый",
    preparing: "Готовится",
    ready: "Готов",
    done: "Выдан",
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Skeleton className="h-12 w-48 mb-8" />
        <Skeleton className="h-32 w-full rounded-3xl mb-6" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Личный кабинет</h1>

        {/* User Info Card */}
        <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.username}</h2>
                {user.email && <p className="text-muted-foreground text-sm">{user.email}</p>}
                {user.phone && <p className="text-muted-foreground text-sm">{user.phone}</p>}
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Orders */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">История заказов</h2>
          </div>

          {ordersLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full rounded-3xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-card border border-dashed rounded-3xl p-10 text-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold mb-1">Заказов пока нет</p>
              <p className="text-sm text-muted-foreground mb-4">Самое время что-нибудь заказать</p>
              <Button
                className="rounded-full"
                onClick={() => setLocation("/menu")}
                data-testid="button-go-menu"
              >
                Перейти в меню
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <motion.div
                  key={order.objectId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border rounded-3xl p-6 shadow-sm"
                  data-testid={`order-card-${order.objectId}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-bold text-lg">Заказ #{order.objectId.slice(-6).toUpperCase()}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${
                        order.status === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex flex-col gap-2">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {it.name}
                          <span className="text-muted-foreground ml-1">× {it.qty}</span>
                        </span>
                        <span className="font-medium">{it.price * it.qty} ₽</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Итого</span>
                    <span className="text-xl font-bold text-primary">{order.total} ₽</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
