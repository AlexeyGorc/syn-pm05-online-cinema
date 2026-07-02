import Navbar from '@/components/Navbar';
import Slider from '@/components/Slider';

export default function Home() {
    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar showLogout={false} />
            <main>
                <Slider />
                <div className="container" style={{ padding: '40px 16px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
                        Добро пожаловать
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Тысячи фильмов в одном месте. Выберите тариф и начните смотреть.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a href="/register" style={{
                            display: 'inline-block',
                            padding: '10px 24px',
                            background: 'var(--accent)',
                            color: '#fff',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '14px',
                        }}>
                            Начать
                        </a>
                        <a href="/login" style={{
                            display: 'inline-block',
                            padding: '10px 24px',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '14px',
                        }}>
                            Войти
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}