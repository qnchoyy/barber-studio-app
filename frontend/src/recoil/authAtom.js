import { atom } from 'recoil';

export const authAtom = atom({
    key: 'authAtom',
    default: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    },
});