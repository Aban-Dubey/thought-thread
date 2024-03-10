import { create } from 'zustand';

export const useAuthStore = create((set)=>({
    auth: {
        username: '',
        userId: null,
        active: false
    },
    setUsername: (name)=>set((state)=>({auth: {...state.auth, username: name}})),
    setUserId: (id) => set((state) => ({ auth: { ...state.auth, userId: id } })),
}));