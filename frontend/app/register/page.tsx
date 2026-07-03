'use client';

import {useEffect, useState} from 'react';
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
                    Регистрация
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                    Создайте аккаунт
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин</label>
                        <input
                            name="login"
                            value={form.login}
                            onChange={handleChange}
                            placeholder="Минимум 6 символов, латиница и цифры"
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
                            placeholder="Минимум 8 символов"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Подтверждение пароля</label>
                        <input
                            name="confirm_password"
                            type="password"
                            value={form.confirm_password}
                            onChange={handleChange}
                            placeholder="Повторите пароль"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>ФИО</label>
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            placeholder="Иванов Иван Иванович"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handlePhoneChange}
                            placeholder="8(XXX)XXX-XX-XX"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="example@mail.ru"
                            required
                        />
                    </div>

                    {error && <p className="error" style={{ marginBottom: '16px' }}>{error}</p>}

                    <button type="submit">Зарегистрироваться</button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Уже есть аккаунт?{' '}
                    <a href="/login">Войти</a>
                </p>
            </div>
        </div>
    );
}