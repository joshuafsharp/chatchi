import { create } from 'zustand';

export interface EnergyState {
  isSleeping: boolean;
  value: number;
  increase: (by: number) => void;
  decrease: (by: number) => void;
  toggleSleeping: (sleeping: boolean) => void;
}

export const useEnergyStore = create<EnergyState>()((set) => ({
  isSleeping: false,
  value: 100,
  increase: (by: number) => set((state) => ({ value: state.value + by })),
  decrease: (by: number) => set((state) => ({ value: state.value + by })),
  toggleSleeping: (sleeping: boolean) => set(() => ({ isSleeping: sleeping })),
}));
