'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Movie {
    id: number;
    title: string;
    description: string;
    genre: string;
    duration_min: number;
    age_rating: string;
    poster_url: string;
}

export default function Slider() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [current, setCurrent] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 500);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/api/movies')
            .then(res => res.json())
            .then(data => setMovies(data || []));
    }, []);

    useEffect(() => {
        if (movies.length === 0) return;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % movies.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [movies]);

    const prev = () => setCurrent(prev => (prev - 1 + movies.length) % movies.length);
    const next = () => setCurrent(prev => (prev + 1) % movies.length);

    if (movies.length === 0) return (
        <div style={{ width: '100%', height: isMobile ? '420px' : '500px', background: '#1f1f1f' }} />
    );

    const movie = movies[current];

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '420px' : '500px',
            overflow: 'hidden',
        }}>
            {/* Размытый фон */}
            {movies.map((m, i) => (
                <div key={`bg-${i}`} style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: i === current ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                }}>
                    <Image
                        src={m.poster_url}
                        alt=""
                        fill
                        sizes="100vw"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            filter: 'blur(24px) brightness(0.3)',
                            transform: 'scale(1.1)',
                        }}
                    />
                </div>
            ))}

            {/* Затемнение */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #141414 0%, transparent 100%)',
                zIndex: 1,
            }} />

            {/* Контент */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {isMobile ? (
                    // Мобильный: постер сверху по центру, текст снизу
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        padding: '16px 24px 0',
                        gap: '16px',
                    }}>
                        <div style={{
                            width: '120px',
                            height: '180px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
                            position: 'relative',
                            flexShrink: 0,
                        }}>
                            <Image
                                src={movie.poster_url}
                                alt={movie.title}
                                fill
                                sizes="120px"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div style={{ textAlign: 'center', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                }}>
                  {movie.age_rating}
                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{movie.genre}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{movie.duration_min} мин</span>
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>{movie.title}</h2>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}>
                                {movie.description}
                            </p>
                            <a href={isLoggedIn ? '/movies' : '/register'} style={{
                                display: 'inline-block',
                                marginTop: '20px',
                                padding: '10px 24px',
                                background: 'var(--accent)',
                                color: '#fff',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '14px',
                                textDecoration: 'none',
                            }}>
                                {isLoggedIn ? 'Смотреть' : 'Начать просмотр'}
                            </a>
                        </div>
                    </div>
                ) : (
                    // Десктоп: постер слева, текст справа
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px',
                        maxWidth: '800px',
                        width: '100%',
                        padding: '0 60px',
                    }}>
                        <div style={{
                            flexShrink: 0,
                            width: '180px',
                            height: '270px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                            position: 'relative',
                        }}>
                            <Image
                                src={movie.poster_url}
                                alt={movie.title}
                                fill
                                sizes="180px"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                }}>
                  {movie.age_rating}
                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{movie.genre}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{movie.duration_min} мин</span>
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>{movie.title}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                                {movie.description}
                            </p>
                            <a href={isLoggedIn ? '/movies' : '/register'} style={{
                                display: 'inline-block',
                                marginTop: '20px',
                                padding: '10px 24px',
                                background: 'var(--accent)',
                                color: '#fff',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '14px',
                                textDecoration: 'none',
                            }}>
                                {isLoggedIn ? 'Смотреть' : 'Начать просмотр'}
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Кнопки назад/вперёд */}
            <button onClick={prev} aria-label="Предыдущий слайд" style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
            }}>‹</button>

            <button onClick={next} aria-label="Следующий слайд" style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
            }}>›</button>

            {/* Точки */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                zIndex: 10,
            }}>
                {movies.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Слайд ${i + 1}`}
                        style={{
                            width: i === current ? '20px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}