import { create } from 'zustand';
import { devtools } from '@pavlobu/zustand/middleware'
const userStore = create(devtools((set) => ({
    authenticated: false,
    user: {
        username: '',
        user_id: '',
        user_gc: 0,
        invite_code: '',
        banned: false,
    },
    toggleAuth: (new_state) => set((state) => ({ authenticated: new_state })),
    setName: (name) => set((state) => ({ user: { ...state.user, username: name }})),
    setUserId: (user_id) => set((state) => ({ user: { ...state.user, user_id }})),
    setUserGc: (user_gc) => set((state) => ({ user: { ...state.user, user_gc }})),
    setUserInvite: (invite_code) => set((state) => ({ user: { ...state.user, invite_code }})),
    useTokens: (access_token, refresh_token) => set((state) => ({ user: { ...state.user, access_token, refresh_token } })),
    setBanned: (banned) => set((state) => ({ user: { ...state.user, banned }}))
})))

const themeStore = create(devtools((set) => ({
    theme: 'light',
    toggle: () => set((state) => ({ theme: state.theme === 'light' ? 'dark':'light' }))
})))

export {
    userStore,
    themeStore
}
