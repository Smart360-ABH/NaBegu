import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/hooks/use-order";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, ArrowLeft, CheckCircle2, MapPin, ShoppingBag, Tag, X } from "lucide-react";
import { YandexMap } from "@/components/YandexMap";

const WHATSAPP_NUMBER = "79409225229";
const CARD_NUMBER = "2200 7007 3602 7059";
const CARD_HOLDER = "НаБегу";

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  promo10: { discount: 0.10, label: "10%" },
};

type DeliveryMode = "pickup" | "delivery";

function buildWhatsAppMessage(
  items: { name: string; price: number; qty: number }[],
  subtotal: number,
  finalTotal: number,
  name: string,
  phone: string,
  mode: DeliveryMode,
  address: string,
  promoCode: string | null,
  discountAmount: number,
): string {
  const header = `🍔 *Заказ НаБегу*\n`;
  const divider = `──────────────────\n`;

  const deliveryLine =
    mode === "delivery"
      ? `🛵 *Способ:* Доставка\n📍 *Адрес:* ${address}\n`
      : `🏪 *Способ:* Самовывоз\n`;

  const itemLines = items
    .map((it) => `• ${it.name} × ${it.qty} — ${it.price * it.qty} ₽`)
    .join("\n");

  const promoLine = promoCode
    ? `\n🏷 *Промокод:* ${promoCode.toUpperCase()} (−${discountAmount} ₽)\n💰 *Итого со скидкой:* ${finalTotal} ₽`
    : `\n💰 *Итого:* ${finalTotal} ₽`;

  const client = `\n👤 *Клиент:* ${name}\n📞 *Телефон:* ${phone}`;
  const payment = `\n\n💳 *Оплата по карте:*\n${CARD_NUMBER}\nПолучатель: ${CARD_HOLDER}`;
  const footer = `\n\n✅ Ждём подтверждения!`;

  return (
    header +
    divider +
    deliveryLine +
    divider +
    `*Состав заказа:*\n` +
    itemLines +
    (promoCode ? `\n\n*Сумма без скидки:* ${subtotal} ₽` : "") +
    promoLine +
    divider +
    client +
    payment +
    footer
  );
}

export default function Order() {
  const { items, updateQty, removeItem, total, totalItems, clearCart } = useCart();
  const { submitOrder, isSubmitting } = useOrder();
  const { user } = useAuth();

  const [name, setName] = useState(user?.username ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [mode, setMode] = useState<DeliveryMode>("pickup");
  const [address, setAddress] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const promoData = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const discountAmount = promoData ? Math.round(total * promoData.discount) : 0;
  const finalTotal = total - discountAmount;

  const applyPromo = () => {
    const code = promoInput.trim().toLowerCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError(null);
      setPromoInput("");
    } else {
      setPromoError("Промокод не найден или уже недействителен");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const canSubmit = name.trim() && phone.trim() && (mode === "pickup" || address.trim());

  const handleWhatsApp = async () => {
    if (!canSubmit || items.length === 0) return;
    await submitOrder(name, phone, items, finalTotal, user?.objectId);
    const msg = buildWhatsAppMessage(items, total, finalTotal, name, phone, mode, address, appliedPromo, discountAmount);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 text-green-600 p-6 rounded-full mb-6"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Заказ отправлен!</h1>
        <p className="text-lg text-muted-foreground mb-2 max-w-md">
          Чек отправлен в WhatsApp. Ожидайте подтверждения от оператора.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Оплата по карте: <span className="font-semibold">{CARD_NUMBER}</span>
        </p>
        <Link href="/menu">
          <Button size="lg" className="rounded-full" data-testid="button-back-menu">
            Вернуться к меню
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Оформление заказа</h1>

      {items.length === 0 ? (
        <div className="bg-card border border-dashed rounded-3xl p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ваша корзина пуста</h2>
          <p className="text-muted-foreground mb-6">Самое время добавить в неё что-нибудь вкусное.</p>
          <Link href="/menu">
            <Button size="lg" className="rounded-full">Перейти в меню</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — Cart */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">
                Ваш заказ ({totalItems})
              </h2>
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-primary font-medium">{item.price} ₽</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center bg-muted rounded-full p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          data-testid={`button-qty-minus-${item.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium" data-testid={`qty-${item.id}`}>{item.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          data-testid={`button-qty-plus-${item.id}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="font-bold text-lg w-20 text-right">{item.price * item.qty} ₽</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
                        onClick={() => removeItem(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <Link href="/menu" className="inline-flex items-center text-primary font-medium hover:underline self-start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Добавить ещё что-нибудь
            </Link>
          </div>

          {/* Right — Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border sticky top-24 flex flex-col gap-5">
              <h2 className="text-xl font-bold">Детали заказа</h2>

              {/* Delivery / Pickup toggle */}
              <div>
                <Label className="mb-2 block text-sm">Способ получения</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("pickup")}
                    data-testid="button-mode-pickup"
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 text-sm font-semibold transition-colors ${
                      mode === "pickup"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Самовывоз
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("delivery")}
                    data-testid="button-mode-delivery"
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 text-sm font-semibold transition-colors ${
                      mode === "delivery"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    Доставка
                  </button>
                </div>
              </div>

              {/* Address — shown only for delivery */}
              {mode === "delivery" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <YandexMap
                    onAddressSelect={(addr) => setAddress(addr)}
                    selectedAddress={address}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Input
                      id="address"
                      placeholder="Улица, дом, квартира (или выберите на карте)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="rounded-xl"
                      data-testid="input-address"
                    />
                  </div>
                </motion.div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  placeholder="Как к вам обращаться?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-xl"
                  data-testid="input-name"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="rounded-xl"
                  data-testid="input-phone"
                />
              </div>

              {/* Promo code */}
              <div className="space-y-2">
                <Label htmlFor="promo">Промокод</Label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Tag className="w-4 h-4" />
                      <span className="font-semibold uppercase">{appliedPromo}</span>
                      <span className="text-sm">— скидка {promoData?.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      aria-label="Убрать промокод"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      placeholder="Введите промокод"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      className="rounded-xl"
                      data-testid="input-promo"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyPromo}
                      className="rounded-xl shrink-0"
                      data-testid="button-apply-promo"
                    >
                      Применить
                    </Button>
                  </div>
                )}
                {promoError && (
                  <p className="text-sm text-red-500">{promoError}</p>
                )}
              </div>

              {/* Payment info */}
              <div className="bg-muted rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Оплата по карте
                </p>
                <p className="font-bold text-base tracking-wider">{CARD_NUMBER}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{CARD_HOLDER}</p>
              </div>

              {/* Total + WhatsApp button */}
              <div className="pt-2 border-t">
                {appliedPromo && (
                  <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                    <span>Сумма:</span>
                    <span className="line-through">{total} ₽</span>
                  </div>
                )}
                {appliedPromo && (
                  <div className="flex justify-between items-center mb-2 text-sm text-green-600 font-medium">
                    <span>Скидка ({promoData?.label}):</span>
                    <span>−{discountAmount} ₽</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Итого:</span>
                  <span className="text-3xl font-bold text-primary">{finalTotal} ₽</span>
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 rounded-full text-base font-bold gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
                  disabled={isSubmitting || !canSubmit}
                  onClick={handleWhatsApp}
                  data-testid="button-whatsapp-order"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Заказать через WhatsApp
                </Button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
