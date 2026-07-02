'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Navbar from '@/components/Navbar';

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
    new: '#a3a3a3',
    active: '#16a34a',
    expired: '#e50914',
    cancelled: '#6b7280',
};

export default function AdminPage() {
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [filtered, setFiltered] = useState<Subscription[]>([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    const fetchSubscriptions = async () => {
        try {
            const data = await apiFetch('/api/admin/subscriptions');
            const list = data || [];
            setSubscriptions(list);
            setFiltered(list);
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

    useEffect(() => {
        if (filterStatus === 'all') {
            setFiltered(subscriptions);
        } else {
            setFiltered(subscriptions.filter(s => s.status === filterStatus));
        }
        setPage(1);
    }, [filterStatus, subscriptions]);

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleStatusChange = async (id: number, status: string) => {
        setError('');
        try {
            await apiFetch(`/api/admin/subscriptions/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            });
            showSuccess('Статус обновлён');
            fetchSubscriptions();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        }
    };

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />

            {/* Toast */}
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
                }}>
                    {success}
                </div>
            )}

            <div className="container" style={{ padding: '32px 16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                    Панель администратора
                </h1>

                {error && <p className="error" style={{ marginBottom: '16px' }}>{error}</p>}

                {/* Фильтр */}
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ margin: 0, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        Фильтр по статусу:
                    </label>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="all">Все</option>
                        {Object.entries(STATUSES).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Таблица */}
                {paginated.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Подписок не найдено</p>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'auto' }}>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Логин</th>
                                <th>Email</th>
                                <th>Тариф</th>
                                <th>Оплата</th>
                                <th>Статус</th>
                                <th>Начало</th>
                                <th>Окончание</th>
                                <th>Действие</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginated.map((sub) => (
                                <tr key={sub.id}>
                                    <td>{sub.id}</td>
                                    <td>{sub.login}</td>
                                    <td>{sub.email}</td>
                                    <td>{PLANS[sub.plan] || sub.plan}</td>
                                    <td>{PAYMENT_METHODS[sub.payment_method] || sub.payment_method}</td>
                                    <td>
                      <span style={{ color: STATUS_COLORS[sub.status], fontWeight: 500 }}>
                        {STATUSES[sub.status] || sub.status}
                      </span>
                                    </td>
                                    <td>{new Date(sub.started_at).toLocaleDateString('ru-RU')}</td>
                                    <td>{new Date(sub.expires_at).toLocaleDateString('ru-RU')}</td>
                                    <td>
                                        <select
                                            value={sub.status}
                                            onChange={e => handleStatusChange(sub.id, e.target.value)}
                                            style={{ width: '130px' }}
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
                    </div>
                )}

                {/* Пагинация */}
                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '16px',
                    }}>
                        <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{
                                width: 'auto',
                                padding: '6px 14px',
                                opacity: page === 1 ? 0.4 : 1,
                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            ←
                        </button>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {page} / {totalPages}
            </span>
                        <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{
                                width: 'auto',
                                padding: '6px 14px',
                                opacity: page === totalPages ? 0.4 : 1,
                                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}