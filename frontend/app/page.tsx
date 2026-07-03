'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Slider from '@/components/Slider';
import { useAuth } from '@/lib/useAuth';

export default function Home() {
    const { isLoggedIn, isAdmin, ready } = useAuth();
    const router = useRouter();

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <main>
                <Slider />
                <div className="container page-enter" style={{ padding: '40px 16px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
                        Добро пожаловать
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Тысячи фильмов в одном месте. Выберите тариф и начните смотреть.
                    </p>
                    {ready && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <a href="/movies" style={{
                                display: 'inline-block',
                                padding: '10px 24px',
                                background: 'var(--accent)',
                                color: '#fff',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '14px',
                            }}>
                                Каталог фильмов
                            </a>
                            {!isLoggedIn && (
                                <a href="/register" style={{
                                    display: 'inline-block',
                                    padding: '10px 24px',
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text)',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                }}>
                                    Начать
                                </a>
                            )}
                            {isLoggedIn && (
                                <a href={isAdmin ? '/admin' : '/dashboard'} style={{
                                    display: 'inline-block',
                                    padding: '10px 24px',
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text)',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                }}>
                                    {isAdmin ? 'Панель admin' : 'Мой профиль'}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}