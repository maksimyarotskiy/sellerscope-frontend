import { useState, useRef, useEffect } from 'react';
import { getAccessToken, clearTokens } from '../utils/token';
import { useNavigate } from 'react-router-dom';
import type { ProductSnapshot } from '../types/product';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface JwtPayload {
    sub: string; // Email пользователя
}

export default function HomePage() {
    const [article, setArticle] = useState('');
    const [result, setResult] = useState<ProductSnapshot[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const cardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            navigate('/sign-in');
        } else {
            try {
                const decoded: JwtPayload = jwtDecode(accessToken);
                setUserEmail(decoded.sub);
            } catch {
                console.error('Ошибка декодирования токена');
                setUserEmail('Неизвестный пользователь');
            }
        }
    }, [navigate]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    };

    const fetchProduct = async () => {
        if (!article.trim() || !/^\d+$/.test(article)) {
            setError('Артикул должен содержать только цифры');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const response = await api.get(`/track/history/${article}`);
            setResult(response.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(`Ошибка получения истории: ${err.message}${err.response?.data ? ' - ' + JSON.stringify(err.response.data) : ''}`);
                console.error('Fetch product error:', err.response?.data || err);
            } else {
                setError('Неизвестная ошибка');
                console.error('Fetch product error:', err);
            }
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearTokens();
        navigate('/sign-in');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 font-sans text-gray-200 relative">
            <div className="fixed top-4 right-4 flex justify-between items-center w-[320px] z-50 bg-gray-900/80 rounded-md px-6 py-2 shadow-lg">
                  <span
                      className="text-indigo-200 font-semibold truncate max-w-[75%]"
                      style={{ marginRight: '12px' }}
                  >
                    {userEmail || 'Загрузка...'}
                  </span>
                <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md bg-indigo-700/60 hover:bg-indigo-700/80 active:bg-indigo-700/90 text-indigo-200 font-semibold transition duration-300 whitespace-nowrap"
                >
                    Выход
                </button>
            </div>


            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                className="group relative max-w-3xl w-full mx-auto mt-20 p-8 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 bg-gray-900/70 overflow-hidden"
            >
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'radial-gradient(600px at var(--x) var(--y), rgba(99,102,241,0.08), transparent 80%)',
                    }}
                ></div>

                <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-200 drop-shadow-[0_2px_4px_rgba(99,102,241,0.3)] tracking-wide">
                    Добро пожаловать в SellerScope
                </h1>

                <div className="flex flex-col sm:flex-row gap-5 mb-6">
                    <input
                        className="flex-grow border border-gray-600 rounded-lg px-5 py-3 text-gray-100 bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 hover:ring-2 hover:ring-indigo-400/50 transition-all duration-200 ease-in-out"
                        value={article}
                        onChange={(e) => setArticle(e.target.value)}
                        placeholder="Введите артикул товара на Wildberries"
                        disabled={loading}
                    />
                    <button
                        onClick={fetchProduct}
                        disabled={loading}
                        className={`relative px-8 py-3 rounded-md font-semibold text-indigo-50 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 shadow-lg shadow-indigo-700/60 hover:from-indigo-500 hover:via-indigo-600 hover:to-indigo-700 active:scale-95 active:shadow-indigo-800/80 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-400/70 focus:ring-offset-1 ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                        <span className="relative z-10">{loading ? 'Загрузка...' : 'Показать историю'}</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-5 text-center text-red-400 font-semibold animate-pulse">
                        {error}
                    </div>
                )}

                {result && result.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-6 shadow-inner overflow-x-auto max-h-[450px]">
                        <h3 className="text-2xl font-bold mb-4 text-indigo-300 border-b border-indigo-600 pb-2">
                            История:
                        </h3>
                        <div className="space-y-4">
                            {result.map((snapshot, index) => (
                                <div
                                    key={snapshot.id || index}
                                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                                >
                                    <p className="text-gray-100">
                                        <strong>Дата:</strong> {new Date(snapshot.createdAt).toLocaleString()}
                                    </p>
                                    <p className="text-gray-100">
                                        <strong>Название:</strong> {snapshot.name}
                                    </p>
                                    <p className="text-gray-100">
                                        <strong>Цена:</strong> {snapshot.price} ₽
                                    </p>
                                    <p className="text-gray-100">
                                        <strong>Отзывы:</strong> {snapshot.reviewCount}
                                    </p>
                                    <p className="text-gray-100">
                                        <strong>Рейтинг:</strong> {snapshot.rating}
                                    </p>
                                    {snapshot.changed && (
                                        <p className="text-gray-100">
                                            <strong>Изменённые поля:</strong>{' '}
                                            {snapshot.changedFields.length > 0 ? snapshot.changedFields.join(', ') : 'Нет изменений'}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {result && result.length === 0 && (
                    <div className="bg-gray-800 rounded-xl p-6 shadow-inner text-center text-gray-100">
                        История для артикула {article} не найдена.
                    </div>
                )}
            </div>
        </div>
    );
}
