import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (newItem) => {
        const existingItem = get().cart.find((item) => item.id === newItem.id);

        if (existingItem) {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          }));
        } else {
          set((state) => ({
            cart: [...state.cart, newItem],
          }));
        }
      },

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),
    }),

    { name: "cart-storage" } // persist to localStorage
  )
);

export default useCartStore;
