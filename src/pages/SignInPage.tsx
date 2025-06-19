import { useState, useRef } from 'react';
import { signIn } from '../api/auth';
import { saveTokens } from '../utils/token';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const tokens = await signIn({ email, password });
            saveTokens(tokens.accessToken, tokens.refreshToken);
            navigate('/');
        } catch (err) {
            setError('Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center
               bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700
               p-6 font-sans text-gray-200"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                className="group relative max-w-md w-full p-8 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 bg-gray-900/70 overflow-hidden"
            >
                {/* Подсветка от курсора */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background:
                            'radial-gradient(600px at var(--x) var(--y), rgba(59,130,246,0.1), transparent 80%)',
                    }}
                />

                <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-200 drop-shadow-[0_2px_4px_rgba(99,102,241,0.3)] tracking-wide">
                    Вход
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="border border-gray-600 rounded-lg px-5 py-3 text-gray-100 bg-gray-800 placeholder-gray-500
                            focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400
                            hover:ring-2 hover:ring-blue-300/50 transition-all duration-200 ease-in-out"
                        disabled={loading}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        required
                        className="border border-gray-600 rounded-lg px-5 py-3 text-gray-100 bg-gray-800 placeholder-gray-500
                            focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400
                            hover:ring-2 hover:ring-blue-300/50 transition-all duration-200 ease-in-out"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`relative px-8 py-3 rounded-md font-semibold text-indigo-50
                        bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800
                        shadow-lg shadow-indigo-700/60
                        hover:from-indigo-500 hover:via-indigo-600 hover:to-indigo-700
                        active:scale-95 active:shadow-indigo-800/80
                        transition duration-300 ease-in-out
                        focus:outline-none focus:ring-4 focus:ring-indigo-400/70 focus:ring-offset-1
                        ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                        `}
                    >
                      <span className="relative z-10">
                        {loading ? 'Загрузка...' : 'Войти'}
                      </span>
                    </button>

                </form>

                {error && (
                    <div className="mt-5 text-center text-red-400 font-semibold animate-pulse">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
