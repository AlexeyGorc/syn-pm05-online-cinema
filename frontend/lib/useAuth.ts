'use client';

import { useState, useEffect } from 'react';
import { getToken, getRole } from './auth';

export function useAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<number>(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setToken(getToken());
        setRole(getRole());
        setReady(true);
    }, []);

    return { token, role, ready, isLoggedIn: !!token, isAdmin: role === 1 };
}