'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import NavBar from '@/components/Navbar';

interface Subscription {
    id: number;
    plan: string;
    payment_method: string;
    status: string;
    started_at: string;
    expires_at: string;
}

const PLANS: Record<string, string> = {
    basic: 'Basic',
    standard: 'Standard',
    premium: 'Premium',
};

const PAYMENT_METHODS: Record<string, string> = {
    card: 'Банковская карта',
    sbp: 'СБП',
};

const STATUSES: Record<string, string> = {
    new: 'Новая',
    active: 'Активна',
    expired: 'Истекла',
    cancelled: 'Отменена',
};

const STATUS_COLORS: Record<string, string> = {
    new: '#a3a3a3',
    active: '#16a34a',
    expired: '#e50914',
    cancelled: '#6b7280',
};

const PERIODS: { label: string; months: number }[] = [
    { label: '1 месяц', months: 1 },
    { label: '3 месяца', months: 3 },
    { label: '6 месяцев', months: 6 },
    { label: '1 год', months: 12 },
];

function addMonths(months: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
}

export default function DashboardPage() {
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({
        plan: 'basic',
        payment_method: 'card',
        period: 1,
    });
    const [upgradePlan, setUpgradePlan] = useState('basic');

    const fetchSubscriptions = async () => {
        try {
            const data = await apiFetch('/api/user/subscriptions');
            const list: Subscription[] = data || [];
            setSubscriptions(list);
            const active = list.find(s => s.status === 'new' || s.status === 'active') || null;
            setActiveSubscription(active);
            if (active) setUpgradePlan(active.plan);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchSubscriptions();
    }, []);

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.name === 'period' ? Number(e.target.value) : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await apiFetch('/api/user/subscriptions', {
                method: 'POST',
                body: JSON.stringify({
                    plan: form.plan,
                    payment_method: form.payment_method,
                    expires_at: addMonths(form.period),
                }),
            });
            showSuccess('Подписка успешно оформлена');
            setForm({ plan: 'basic', payment_method: 'card', period: 1 });
            fetchSubscriptions();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        }
    };

    const handleUpgrade = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await apiFetch('/api/user/subscriptions/upgrade', {
                method: 'PATCH',
                body: JSON.stringify({ plan: upgradePlan }),
            });
            showSuccess('Тариф успешно изменён');
            fetchSubscriptions();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <NavBar />

            <div className="container" style={{ padding: '32px 16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                    Мои подписки
                </h1>

                {/* Toast уведомление */}
                {success && (
                    <div style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: '#16a34a',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        zIndex: 1000,
                        animation: 'fadeIn 0.3s ease',
                    }}>
                        {success}
                    </div>
                )}

                {/* Форма */}
                <div className="card" style={{ marginBottom: '32px', maxWidth: '480px' }}>
                    {activeSubscription ? (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                                Сменить тариф
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                                Текущий тариф: <strong style={{ color: 'var(--text)' }}>{PLANS[activeSubscription.plan]}</strong>
                            </p>
                            <form onSubmit={handleUpgrade}>
                                <div className="form-group">
                                    <label>Новый тариф</label>
                                    <select value={upgradePlan} onChange={e => setUpgradePlan(e.target.value)}>
                                        {Object.entries(PLANS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                {error && <p className="error" style={{ marginBottom: '12px' }}>{error}</p>}
                                <button type="submit">Сменить тариф</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                                Оформить подписку
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Тариф</label>
                                    <select name="plan" value={form.plan} onChange={handleChange}>
                                        {Object.entries(PLANS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Способ оплаты</label>
                                    <select name="payment_method" value={form.payment_method} onChange={handleChange}>
                                        {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Период</label>
                                    <select name="period" value={form.period} onChange={handleChange}>
                                        {PERIODS.map(({ label, months }) => (
                                            <option key={months} value={months}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                {error && <p className="error" style={{ marginBottom: '12px' }}>{error}</p>}
                                <button type="submit">Оформить подписку</button>
                            </form>
                        </>
                    )}
                </div>

                {/* Таблица */}
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                    История подписок
                </h2>
                {subscriptions.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Подписок пока нет</p>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'auto' }}>
                        <table>
                            <thead>
                            <tr>
                                <th>Тариф</th>
                                <th>Оплата</th>
                                <th>Статус</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Окончание</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub.id}>
                                    <td>{PLANS[sub.plan] || sub.plan}</td>
                                    <td>{PAYMENT_METHODS[sub.payment_method] || sub.payment_method}</td>
                                    <td>
            <span style={{ color: STATUS_COLORS[sub.status], fontWeight: 500 }}>
              {STATUSES[sub.status] || sub.status}
            </span>
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {new Date(sub.expires_at).toLocaleDateString('ru-RU')}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}