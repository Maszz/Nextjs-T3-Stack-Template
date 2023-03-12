// store/store.js
import create from 'zustand';
// create store

interface ColorState {
  color: string;
  changeColor: () => void;
}

const useColorStore = create<ColorState>((set) => ({
  color: 'white',
  changeColor: () =>
    set((state) => ({ color: state.color === 'white' ? '#212529' : 'white' })),
}));
export default useColorStore;
