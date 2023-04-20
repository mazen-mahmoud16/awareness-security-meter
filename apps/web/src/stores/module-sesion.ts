import create from "zustand";

export interface ModuleSessionStore {
  onFinish(): void;
  setOnFinish(cb: () => void): void;
  module?: string;
  setModule(m: string): void;
}

export const useModuleSessionStore = create<ModuleSessionStore>((set) => ({
  onFinish() {},
  setOnFinish(cb) {
    set({ onFinish: cb });
  },
  setModule(m) {
    set({ module: m });
  },
}));
