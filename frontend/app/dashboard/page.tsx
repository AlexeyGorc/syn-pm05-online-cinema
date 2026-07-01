'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

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
    new: '#6b7280',
    active: '#16a34a',
    expired: '#dc2626',
    cancelled: '#9ca3af',
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
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1>Мои подписки</h1>
                <button style={{ ...buttonStyle, background: '#6b7280' }} onClick={handleLogout}>Выйти</button>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '32px' }}>
                {activeSubscription ? (
                    <>
                        <h2 style={{ marginBottom: '16px' }}>Апгрейд тарифа</h2>
                        <p style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
                            Текущий тариф: <strong>{PLANS[activeSubscription.plan]}</strong>
                        </p>
                        <form onSubmit={handleUpgrade}>
                            <div>
                                <label style={labelStyle}>Новый тариф</label>
                                <select
                                    value={upgradePlan}
                                    onChange={e => setUpgradePlan(e.target.value)}
                                    style={inputStyle}
                                >
                                    {Object.entries(PLANS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                            <button style={buttonStyle} type="submit">Сменить тариф</button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 style={{ marginBottom: '16px' }}>Оформить подписку</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label style={labelStyle}>Тариф</label>
                                <select name="plan" value={form.plan} onChange={handleChange} style={inputStyle}>
                                    {Object.entries(PLANS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Способ оплаты</label>
                                <select name="payment_method" value={form.payment_method} onChange={handleChange} style={inputStyle}>
                                    {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Период</label>
                                <select name="period" value={form.period} onChange={handleChange} style={inputStyle}>
                                    {PERIODS.map(({ label, months }) => (
                                        <option key={months} value={months}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                            <button style={buttonStyle} type="submit">Оформить подписку</button>
                        </form>
                    </>
                )}
            </div>

            <h2 style={{ marginBottom: '16px' }}>История подписок</h2>
            {subscriptions.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Подписок пока нет</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Тариф</th>
                        <th style={{ padding: '8px' }}>Оплата</th>
                        <th style={{ padding: '8px' }}>Статус</th>
                        <th style={{ padding: '8px' }}>Начало</th>
                        <th style={{ padding: '8px' }}>Окончание</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subscriptions.map((sub) => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '8px' }}>{PLANS[sub.plan] || sub.plan}</td>
                            <td style={{ padding: '8px' }}>{PAYMENT_METHODS[sub.payment_method] || sub.payment_method}</td>
                            <td style={{ padding: '8px' }}>
                  <span style={{ color: STATUS_COLORS[sub.status] || '#000', fontWeight: 500 }}>
                    {STATUSES[sub.status] || sub.status}
                  </span>
                            </td>
                            <td style={{ padding: '8px' }}>{new Date(sub.started_at).toLocaleDateString('ru-RU')}</td>
                            <td style={{ padding: '8px' }}>{new Date(sub.expires_at).toLocaleDateString('ru-RU')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}