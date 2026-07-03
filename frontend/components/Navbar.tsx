'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { logout } from '@/lib/auth';

export default function Navbar() {
    const router = useRouter();
    const { isLoggedIn, isAdmin, ready } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav style={{ background: '#000', borderBottom: '1px solid var(--border)', padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <a href="/" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '18px', textDecoration: 'none', whiteSpace: 'nowrap' }}>CinemaOnline</a>
                <a href="/movies" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }} className="nav-catalog">Каталог</a>
            </div>

            {ready && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {isLoggedIn ? (
                        <>
                            <a href={isAdmin ? '/admin' : '/dashboard'} style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                {isAdmin ? 'Admin' : 'Профиль'}
                            </a>
                            <button className="btn-secondary" onClick={handleLogout} style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', whiteSpace: 'nowrap' }}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <a href="/login" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Войти</a>
                            <a href="/register" style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Начать</a>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}