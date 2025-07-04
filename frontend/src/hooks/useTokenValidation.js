import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authAtom } from '../recoil/authAtom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useTokenValidation = () => {
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setAuth({ user: null, token: null });

        toast.error('Сесията ви е изтекла. Моля, влезте отново.', {
            duration: 5000,
            style: {
                background: '#7f1d1d',
                color: '#fecaca',
                border: '2px solid #ef4444',
                padding: '16px',
                borderRadius: '12px',
            },
        });

        navigate('/login');
    };

    const isTokenExpired = (token) => {
        if (!token || typeof token !== 'string') {
            return true;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return true;
            }

            const payload = JSON.parse(atob(parts[1]));

            if (!payload.exp || typeof payload.exp !== 'number') {
                return true;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {

            return true;
        }
    };

    const checkTokenValidity = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            if (auth.user) {
                logout();
            }
            return;
        }

        if (isTokenExpired(token)) {
            logout();
            return;
        }

        if (!auth.user && user) {
            try {
                const userData = JSON.parse(user);
                setAuth({ user: userData, token });
            } catch (error) {
                logout();
            }
        }
    };

    useEffect(() => {
        checkTokenValidity();

        const interval = setInterval(() => {
            checkTokenValidity();
        }, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [auth.user]);

    return {
        logout,
        isTokenExpired,
        checkTokenValidity
    };
};