'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [form, setForm] = useState({ login: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(form),
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            if (data.role === 1) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = Number(localStorage.getItem('role'));
        if (token) {
            router.push(role === 1 ? '/admin' : '/dashboard');
        }
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                    Вход
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                    Войдите в свой аккаунт
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин</label>
                        <input
                            name="login"
                            value={form.login}
                            onChange={handleChange}
                            placeholder="Введите логин"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>

                    {error && <p className="error" style={{ marginBottom: '16px' }}>{error}</p>}

                    <button type="submit">Войти</button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Нет аккаунта?{' '}
                    <a href="/register">Зарегистрироваться</a>
                </p>
            </div>
        </div>
    );
}