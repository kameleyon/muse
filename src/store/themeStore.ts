// Simple light theme store with no dark theme functionality
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light';
}

const useThemeStore = create<ThemeState>()(
  persist(
    () => ({
      theme: 'light',
    }),
    {
      name: 'magicmuse-theme',
    }
  )
);

export default useThemeStore;