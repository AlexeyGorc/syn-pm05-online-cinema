'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Movie {
    id: number;
    title: string;
    description: string;
    genre: string;
    duration_min: number;
    age_rating: string;
    poster_url: string;
}

export default function MoviesPage() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMovies = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (genre) params.set('genre', genre);

        const res = await fetch(`http://localhost:8080/api/movies?${params}`);
        const data = await res.json();
        setMovies(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/genres')
            .then(res => res.json())
            .then(data => setGenres(data || []));
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [genre]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMovies();
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />

            <div className="container page-enter" style={{ padding: '32px 16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                    Каталог фильмов
                </h1>

                {/* Фильтры */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px' }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Поиск по названию..."
                            style={{ flex: 1 }}
                        />
                        <button type="submit" style={{ width: 'auto', padding: '10px 20px' }}>
                            Найти
                        </button>
                    </form>

                    <select
                        value={genre}
                        onChange={e => setGenre(e.target.value)}
                        style={{ width: 'auto', minWidth: '160px' }}
                    >
                        <option value="">Все жанры</option>
                        {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* Сетка фильмов */}
                {loading ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                        <div className="spinner" />
                    </div>
                ) : movies.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                        Фильмы не найдены
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: '20px',
                    }}>
                        {movies.map(movie => (
                            <div
                                key={movie.id}
                                onClick={() => router.push(`/movies/${movie.id}`)}
                                className="movie-card"
                            >
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    paddingBottom: '150%',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    marginBottom: '10px',
                                    background: 'var(--surface)',
                                }}>
                                    <Image
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        fill
                                        sizes="(max-width: 500px) 45vw, 200px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'var(--accent)',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                    }}>
                                        {movie.age_rating}
                                    </div>
                                </div>
                                <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                                    {movie.title}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                    {movie.genre} · {movie.duration_min} мин
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}