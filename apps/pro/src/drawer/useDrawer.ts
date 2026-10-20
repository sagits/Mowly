/** App-local UI flag: whether the narrow-screen drawer is open. */
import { create } from 'zustand';

/** Drawer visibility state. */
export type DrawerState = { open: boolean; setOpen(open: boolean): void };

/** Hook over the drawer flag; also `useDrawer.getState()` outside React. */
export const useDrawer = create<DrawerState>((set) => ({ open: false, setOpen: (open) => set({ open }) }));
