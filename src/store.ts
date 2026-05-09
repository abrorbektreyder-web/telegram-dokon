import { create } from 'zustand'

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
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
  clearCart: () => set({ items: [] }),
  totalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = parseInt(item.price.replace(/\s/g, ''));
      return total + (price * item.quantity);
    }, 0);
  }
}));
