'use client';

import { useRouter } from 'next/navigation';

interface NavbarProps {
    showLogout?: boolean;
}

export default function Navbar({ showLogout = true }: NavbarProps) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };

    return (
        <nav style={{
            background: '#000',
            borderBottom: '1px solid var(--border)',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <a href="/" style={{
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: '20px',
                textDecoration: 'none',
            }}>
                CinemaOnline
            </a>

            {showLogout && (
                <button
                    className="btn-secondary"
                    onClick={handleLogout}
                    style={{ width: 'auto', padding: '6px 16px' }}
                >
                    Выйти
                </button>
            )}
        </nav>
    );
}