import { useState } from "react";
import { createObject } from "@/lib/parse";
import { CartItem } from "@/context/CartContext";

export function useOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = async (
    name: string,
    phone: string,
    cartItems: CartItem[],
    total: number,
    userId?: string
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await createObject("Order", {
        customerName: name,
        customerPhone: phone,
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        total,
        status: "new",
        ...(userId ? { userId } : {}),
      });
      return true;
    } catch {
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitOrder, isSubmitting };
}
