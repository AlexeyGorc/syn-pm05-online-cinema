'use client';

import { useState } from 'react';
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

    const inputStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        padding: '6px 10px',
        display: 'block',
        marginBottom: '12px',
        width: '100%',
        borderRadius: '4px',
        color: '#000',
        background: '#fff',
        fontSize: '14px',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: 500,
    };

    const buttonStyle: React.CSSProperties = {
        padding: '8px 20px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '8px',
        width: '100%',
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '24px' }}>Вход</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={labelStyle}>Логин</label>
                    <input style={inputStyle} name="login" value={form.login} onChange={handleChange} required />
                </div>
                <div>
                    <label style={labelStyle}>Пароль</label>
                    <input style={inputStyle} name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                <button style={buttonStyle} type="submit">Войти</button>
            </form>
            <p style={{ marginTop: '16px', fontSize: '14px' }}>
                Нет аккаунта? <a href="/register" style={{ color: '#2563eb' }}>Зарегистрироваться</a>
            </p>
        </div>
    );
}