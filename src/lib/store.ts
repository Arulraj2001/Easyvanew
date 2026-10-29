import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "./types";

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isMobileMenuOpen: false,

      openCart: () => set({ isCartOpen: true, isMobileMenuOpen: false }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () =>
        set((state) => ({
          isCartOpen: !state.isCartOpen,
          isMobileMenuOpen: false,
        })),

      openMobileMenu: () => set({ isMobileMenuOpen: true, isCartOpen: false }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      toggleMobileMenu: () =>
        set((state) => ({
          isMobileMenuOpen: !state.isMobileMenuOpen,
          isCartOpen: false,
        })),

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return {
              items: updatedItems,
              isCartOpen: true,
              isMobileMenuOpen: false,
            };
          }
          return {
            items: [...state.items, { product, quantity }],
            isCartOpen: true,
            isMobileMenuOpen: false,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "easyva_cart_storage",
      // Only persist shopping cart items in localStorage, modal/drawer UI states reset cleanly
      partialize: (state) => ({ items: state.items }),
    }
  )
);
