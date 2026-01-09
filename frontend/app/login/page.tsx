"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        setError('Credenciais inválidas. Verifique e tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Função Dev apenas para facilitar
  const handleRegister = async () => {
    await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    alert('Conta de teste criada! Pode fazer login.');
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* --- LADO ESQUERDO: FORMULÁRIO (BRANCO) --- */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 md:px-24 lg:px-32 relative">
        
        {/* Logo Mobile (Só aparece em telas pequenas) */}
        <div className="lg:hidden absolute top-8 left-8">
            <img src="/logo.png" alt="Paggo" className="h-8 w-auto invert" /> 
            {/* 'invert' inverte as cores se sua logo for branca original, remove se for preta */}
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Bem-vindo</h1>
          <p className="text-slate-500">Insira suas credenciais para acessar o painel.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Input Email */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input 
                        type="email" 
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm"
                        placeholder="nome@empresa.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </div>

            {/* Input Senha */}
            <div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input 
                        type="password" 
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 rounded bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-lg font-bold hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-300 transition-all shadow-lg flex justify-center items-center"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    "Acessar"
                )}
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
                Ainda não tem acesso?{' '}
                <button onClick={handleRegister} className="text-black font-bold hover:underline">
                    Criar conta 
                </button>
            </p>
        </div>
      </div>

      {/* --- LADO DIREITO: BRANDING (PRETO) --- */}
      <div className="hidden lg:flex w-1/2 bg-black flex-col justify-center items-center relative overflow-hidden">
        
        {/* Efeito de Fundo Abstrato (Círculos sutis) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[128px]"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800 rounded-full blur-[128px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
            {/* LOGO GRANDE BRANCA */}
            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                 <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Paggo" className="h-16 w-auto object-contain" />
                    <span className="text-white font-bold text-4xl tracking-widest uppercase opacity-90 font-sans" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        paggo-OCR
                    </span>
                 </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 text-center max-w-md leading-tight">
                Reconhecimento de texto em imagens
            </h2>
        </div>
      </div>

    </div>
  );
}