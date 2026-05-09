import { create } from 'zustand'

interface CartItem {
  id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find(item => item.id === product.id);
    
    if (existingItem) {
      set({
        items: currentItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      });
    } else {
      set({
        items: [...currentItems, { ...product, quantity: 1 }]
      });
    }
  },
  removeItem: (id) => {
    set({ items: get().items.filter(item => item.id !== id) });
  },
  updateQuantity: (id, delta) => {
    const currentItems = get().items;
    set({
      items: currentItems.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    });
  },
  clearCart: () => set({ items: [] }),
  total: () => {
    return get().items.reduce((acc, item) => {
      // Narxdan faqat raqamlarni ajratib olish (Currency agnostic)
      const priceStr = String(item.price || '0').replace(/[^0-9]/g, '');
      const price = parseInt(priceStr, 10) || 0;
      return acc + (price * item.quantity);
    }, 0);
  }
}));
