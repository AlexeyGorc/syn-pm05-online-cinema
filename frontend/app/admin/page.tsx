'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

interface Subscription {
    id: number;
    user_id: number;
    login: string;
    email: string;
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

export default function AdminPage() {
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [error, setError] = useState('');
    const [successId, setSuccessId] = useState<number | null>(null);

    const fetchSubscriptions = async () => {
        try {
            const data = await apiFetch('/api/admin/subscriptions');
            setSubscriptions(data || []);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        }
    };

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (!role || Number(role) !== 1) {
            router.push('/login');
            return;
        }
        fetchSubscriptions();
    }, []);

    const handleStatusChange = async (id: number, status: string) => {
        setError('');
        try {
            await apiFetch(`/api/admin/subscriptions/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            });
            setSuccessId(id);
            setTimeout(() => setSuccessId(null), 2000);
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

    const buttonStyle: React.CSSProperties = {
        padding: '8px 20px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    };

    const selectStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        padding: '4px 8px',
        borderRadius: '4px',
        color: '#000',
        background: '#fff',
        fontSize: '14px',
        marginRight: '8px',
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1>Панель администратора</h1>
                <button style={{ ...buttonStyle, background: '#6b7280' }} onClick={handleLogout}>Выйти</button>
            </div>

            {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

            <h2 style={{ marginBottom: '16px' }}>Все подписки</h2>

            {subscriptions.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Подписок пока нет</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>ID</th>
                        <th style={{ padding: '8px' }}>Логин</th>
                        <th style={{ padding: '8px' }}>Email</th>
                        <th style={{ padding: '8px' }}>Тариф</th>
                        <th style={{ padding: '8px' }}>Оплата</th>
                        <th style={{ padding: '8px' }}>Статус</th>
                        <th style={{ padding: '8px' }}>Начало</th>
                        <th style={{ padding: '8px' }}>Окончание</th>
                        <th style={{ padding: '8px' }}>Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subscriptions.map((sub) => (
                        <tr
                            key={sub.id}
                            style={{
                                borderBottom: '1px solid #e5e7eb',
                                background: successId === sub.id ? '#f0fdf4' : 'transparent',
                                transition: 'background 0.3s',
                            }}
                        >
                            <td style={{ padding: '8px' }}>{sub.id}</td>
                            <td style={{ padding: '8px' }}>{sub.login}</td>
                            <td style={{ padding: '8px' }}>{sub.email}</td>
                            <td style={{ padding: '8px' }}>{PLANS[sub.plan] || sub.plan}</td>
                            <td style={{ padding: '8px' }}>{PAYMENT_METHODS[sub.payment_method] || sub.payment_method}</td>
                            <td style={{ padding: '8px' }}>
                  <span style={{ color: STATUS_COLORS[sub.status] || '#000', fontWeight: 500 }}>
                    {STATUSES[sub.status] || sub.status}
                  </span>
                            </td>
                            <td style={{ padding: '8px' }}>{new Date(sub.started_at).toLocaleDateString('ru-RU')}</td>
                            <td style={{ padding: '8px' }}>{new Date(sub.expires_at).toLocaleDateString('ru-RU')}</td>
                            <td style={{ padding: '8px' }}>
                                <select
                                    style={selectStyle}
                                    value={sub.status}
                                    onChange={e => handleStatusChange(sub.id, e.target.value)}
                                >
                                    {Object.entries(STATUSES).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}