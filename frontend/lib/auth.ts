export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function getRole(): number {
    if (typeof window === 'undefined') return 0;
    return Number(localStorage.getItem('role'));
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

export function logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
}