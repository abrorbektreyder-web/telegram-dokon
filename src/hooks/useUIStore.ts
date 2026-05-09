import { create } from 'zustand'
import { translations } from '../lib/translations'
import type { Language } from '../lib/translations'

interface UIStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['uz']) => string;
}

export const useUIStore = create<UIStore>((set, get) => ({
  language: 'uz',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const lang = get().language;
    return translations[lang][key] || translations['uz'][key] || key;
  }
}));
