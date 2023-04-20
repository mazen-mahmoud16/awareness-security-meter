import create, { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export type Theme = "dark" | "light";

interface ThemeStore {
  theme: Theme;
  changeTheme(t: Theme): void;
}

type MyPersist = (
  config: StateCreator<ThemeStore>,
  options: PersistOptions<ThemeStore>
) => StateCreator<ThemeStore>;

export const useThemeStore = create<ThemeStore>(
  (persist as MyPersist)(
    (set, get) => ({
      theme: "dark",
      changeTheme: (t) => set({ theme: t }),
    }),
    {
      name: "theme",
    }
  )
);
