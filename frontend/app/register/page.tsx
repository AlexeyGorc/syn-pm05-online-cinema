'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        login: '',
        password: '',
        confirm_password: '',
        full_name: '',
        phone: '',
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
        let formatted = '';
        if (digits.length === 0) {
            formatted = '';
        } else if (digits.length <= 1) {
            formatted = digits;
        } else if (digits.length <= 4) {
            formatted = `${digits[0]}(${digits.slice(1)}`;
        } else if (digits.length <= 7) {
            formatted = `${digits[0]}(${digits.slice(1, 4)})${digits.slice(4)}`;
        } else if (digits.length <= 9) {
            formatted = `${digits[0]}(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7)}`;
        } else {
            formatted = `${digits[0]}(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
        }
        setForm({ ...form, phone: formatted });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirm_password) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await apiFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    login: form.login,
                    password: form.password,
                    full_name: form.full_name,
                    phone: form.phone,
                    email: form.email,
                }),
            });
            router.push('/login');
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
            <h1 style={{ marginBottom: '24px' }}>Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={labelStyle}>Логин</label>
                    <input style={inputStyle} name="login" value={form.login} onChange={handleChange} required />
                </div>
                <div>
                    <label style={labelStyle}>Пароль</label>
                    <input style={inputStyle} name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
                <div>
                    <label style={labelStyle}>Подтверждение пароля</label>
                    <input style={inputStyle} name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} required />
                </div>
                <div>
                    <label style={labelStyle}>ФИО</label>
                    <input style={inputStyle} name="full_name" value={form.full_name} onChange={handleChange} required />
                </div>
                <div>
                    <label style={labelStyle}>Телефон</label>
                    <input style={inputStyle} name="phone" value={form.phone} onChange={handlePhoneChange} placeholder="8(XXX)XXX-XX-XX" required />
                </div>
                <div>
                    <label style={labelStyle}>Email</label>
                    <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                <button style={buttonStyle} type="submit">Зарегистрироваться</button>
            </form>
            <p style={{ marginTop: '16px', fontSize: '14px' }}>
                Уже есть аккаунт? <a href="/login" style={{ color: '#2563eb' }}>Войти</a>
            </p>
        </div>
    );
}