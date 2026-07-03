'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface Movie {
    id: number;
    title: string;
    description: string;
    genre: string;
    duration_min: number;
    age_rating: string;
    poster_url: string;
}

export default function MoviePage() {
    const { id } = useParams();
    const router = useRouter();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasSubscription, setHasSubscription] = useState(false);

    useEffect(() => {
        const token = getToken();
        console.log('token:', token);
        setIsLoggedIn(!!token);

        fetch(`http://localhost:8080/api/movies/${id}`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        if (token) {
            console.log('fetching subscription...');
            apiFetch('/api/user/subscription/active')
                .then(data => {
                    console.log('subscription data:', data);
                    setHasSubscription(data.subscription !== null && data.subscription !== undefined);
                })
                .catch((err) => {
                    console.log('subscription error:', err);
                    setHasSubscription(false);
                });
        }
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '80px 16px' }}>
                <div className="spinner" />
            </div>
        </div>
    );

    if (!movie) return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '80px 16px', color: 'var(--text-muted)' }}>
                Фильм не найден
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />

            {/* Размытый фон */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                <Image
                    src={movie.poster_url}
                    alt=""
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: 'cover',
                        filter: 'blur(40px) brightness(0.2)',
                        transform: 'scale(1.1)',
                    }}
                />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, padding: '40px 16px' }}>
                <button
                    onClick={() => router.back()}
                    className="btn-secondary"
                    style={{ width: 'auto', padding: '6px 16px', marginBottom: '32px' }}
                >
                    ← Назад
                </button>

                <div style={{
                    display: 'flex',
                    gap: '40px',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                }}>
                    {/* Постер */}
                    <div style={{
                        position: 'relative',
                        width: '240px',
                        height: '360px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
                    }}>
                        <Image
                            src={movie.poster_url}
                            alt={movie.title}
                            fill
                            sizes="240px"
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>

                    {/* Информация */}
                    <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '4px',
              }}>
                {movie.age_rating}
              </span>
                            <span style={{
                                background: 'var(--surface)',
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                            }}>
                {movie.genre}
              </span>
                            <span style={{
                                background: 'var(--surface)',
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                            }}>
                {movie.duration_min} мин
              </span>
                        </div>

                        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
                            {movie.title}
                        </h1>

                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '15px',
                            lineHeight: '1.7',
                            marginBottom: '32px',
                            maxWidth: '600px',
                        }}>
                            {movie.description}
                        </p>

                        {/* Плеер / CTA в зависимости от состояния */}
                        {!isLoggedIn && (
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => router.push('/register')}
                                    style={{ width: 'auto', padding: '12px 32px', fontSize: '15px' }}
                                >
                                    Начать просмотр
                                </button>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="btn-secondary"
                                    style={{ width: 'auto', padding: '12px 32px', fontSize: '15px' }}
                                >
                                    Войти
                                </button>
                            </div>
                        )}

                        {isLoggedIn && !hasSubscription && (
                            <div className="card" style={{ maxWidth: '480px' }}>
                                <p style={{ marginBottom: '16px', fontSize: '15px' }}>
                                    Для просмотра фильма необходима подписка
                                </p>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    style={{ width: 'auto', padding: '10px 24px' }}
                                >
                                    Оформить подписку
                                </button>
                            </div>
                        )}

                        {isLoggedIn && hasSubscription && (
                            <div style={{ marginTop: '8px' }}>
                                {/* Заглушка плеера */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: '640px',
                                    aspectRatio: '16/9',
                                    background: '#000',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Image
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        fill
                                        sizes="640px"
                                        style={{ objectFit: 'cover', opacity: 0.3 }}
                                    />
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                    }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'rgba(229,9,20,0.9)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease, background 0.2s ease',
                                        }}
                                             onMouseEnter={e => {
                                                 e.currentTarget.style.transform = 'scale(1.1)';
                                                 e.currentTarget.style.background = 'rgba(178,7,16,0.9)';
                                             }}
                                             onMouseLeave={e => {
                                                 e.currentTarget.style.transform = 'scale(1)';
                                                 e.currentTarget.style.background = 'rgba(229,9,20,0.9)';
                                             }}
                                        >
                                            <span style={{ fontSize: '24px', marginLeft: '4px' }}>▶</span>
                                        </div>
                                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                      {movie.title}
                    </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}