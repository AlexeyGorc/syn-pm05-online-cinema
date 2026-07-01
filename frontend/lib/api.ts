const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiFetch(path: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Ошибка сервера');
    }

    return data;
}