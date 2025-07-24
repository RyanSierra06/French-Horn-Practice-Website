import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const ProfileContext = createContext();

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = (user, token) => {
        setUser(user);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error('Failed to refresh user data:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function ProfileProvider({ children }) {
    const { user, token } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState('');
    const [progressRefreshCount, setProgressRefreshCount] = useState(0);

    const refreshProfile = useCallback(async () => {
        if (!user || !token) return;
        setProfileLoading(true);
        setProfileError('');
        try {
            const favRes = await fetch(`${BACKEND_BASE_URL}/api/auth/me/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const favSlugs = favRes.ok ? await favRes.json() : [];

            const exRes = await fetch(`${BACKEND_BASE_URL}/api/excerpts/all`);
            const allExcerpts = exRes.ok ? await exRes.json() : [];

            const favExcerpts = allExcerpts.filter(e => favSlugs.includes(e.slug));

            const progRes = await fetch(`${BACKEND_BASE_URL}/api/progress`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const progress = progRes.ok ? await progRes.json() : [];
            const completedSlugs = progress.filter(p => p.completed).map(p => p.excerptSlug);
            const completedExcerpts = allExcerpts.filter(e => completedSlugs.includes(e.slug));

            setFavorites(favExcerpts);
            setCompleted(completedExcerpts);
        } catch (err) {
            setProfileError('Failed to load profile data');
        } finally {
            setProfileLoading(false);
            setProgressRefreshCount(c => c + 1);
        }
    }, [user, token]);

    useEffect(() => {
        if (user && token) {
            refreshProfile();
        } else {
            setFavorites([]);
            setCompleted([]);
        }
    }, [user, token, refreshProfile]);

    return (
        <ProfileContext.Provider value={{ favorites, completed, profileLoading, profileError, refreshProfile, progressRefreshCount }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
} 