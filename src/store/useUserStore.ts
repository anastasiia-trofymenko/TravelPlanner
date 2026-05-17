import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PaymentMethod = 'applePay' | 'googlePay' | 'card';

type State = {
  name: string;
  email: string;
  preferredPayment: PaymentMethod;
  setName: (n: string) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
};

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      name: 'Temp.',
      email: 'user@travel.app',
      preferredPayment: 'applePay',
      setName: (name) => set({ name }),
      setPaymentMethod: (preferredPayment) => set({ preferredPayment }),
    }),
    {
      name: 'arturio-user',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
