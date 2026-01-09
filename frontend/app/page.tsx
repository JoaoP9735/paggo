"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Documento {
  id: number;
  fileName: string;
  ocrText: string;
  llmSummary: string;
  createdAt: string;
}

export default function Home() {
  // ESTADOS 
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<Documento[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // REFS & HOOKS 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // EFEITOS 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      carregarHistorico();
    }
  }, [router, API_URL]);

  // FUNÇÕES 
  async function carregarHistorico() {
    try {
      const res = await fetch(`${API_URL}/documents`, { cache: 'no-store' });
      const data = await res.json();
      setHistorico(data);
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar este documento?")) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setHistorico(prev => prev.filter(doc => doc.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    setLoading(true);
    setStatus("Processando...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
      if (!response.ok) throw new Error('Falha no upload do arquivo.');

      setStatus("Concluído!");
      carregarHistorico();
      setFile(null);
    } catch (error: any) {
      setStatus(error.message || "Erro desconhecido.");
      if (error.message.includes("Sessão")) router.push('/login');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  // DRAG E DROP
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="fixed inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/80 pointer-events-none z-0"></div>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 select-none group">
            <div className="relative">
              <img src="/logo.png" alt="Paggo" className="h-8 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-white font-bold text-lg tracking-[0.2em] uppercase border-l-2 border-zinc-700 pl-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
              <span className="text-white">paggo-OCR</span>
            </span>
          </div>

          {/* Botão Sair */}
          <button
            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
            className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 px-5 py-2.5 rounded-full"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-16">

        {/* TÍTULO E UPLOAD */}
        <div className="space-y-8">
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
              Extração de textos automática
            </h1>
            <p className="text-zinc-500 max-w-lg mx-auto text-lg leading-relaxed">
              Faça upload de seus arquivos e imagens para extração do texto.
            </p>
          </div>

          {!file ? (
            // ÁREA DE DROP 
            <div
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                group relative w-full h-72 bg-white transition-all duration-300 cursor-pointer 
                flex flex-col items-center justify-center gap-6 border-2 border-dashed rounded-2xl 
                ${dragActive ? 'border-black bg-zinc-50 scale-[1.01] shadow-xl' : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/50 hover:shadow-lg'}
              `}
            >
              <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />

              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200 group-hover:bg-black group-hover:border-black transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8 text-zinc-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>

              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-zinc-900 group-hover:underline decoration-2 underline-offset-4 decoration-zinc-900">
                  Clique ou arraste para selecionar arquivo
                </p>
              </div>
            </div>
          ) : (
            // ÁREA DO ARQUIVO
            <div className="w-full bg-white border border-zinc-200 p-8 rounded-2xl shadow-xl relative overflow-hidden ring-1 ring-zinc-100">
              {loading && <div className="absolute top-0 left-0 h-1.5 bg-black animate-progress w-full"></div>}

              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-zinc-900 flex items-center justify-center text-white rounded-xl shadow-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-xl font-bold text-zinc-900 truncate">{file.name}</h3>
                  <p className="text-sm text-zinc-500 font-mono mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setFile(null)}
                  disabled={loading}
                  className="px-6 py-4 rounded-xl text-sm font-bold text-zinc-500 hover:text-black border border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-white transition-all disabled:opacity-50"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-3 disabled:opacity-90 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      PROCESSANDO...
                    </>
                  ) : "ENVIAR PARA ANÁLISE"}
                </button>
              </div>

              {status && (
                <p className="mt-6 text-xs font-mono text-center text-zinc-500 uppercase tracking-widest animate-pulse">
                  {status}
                </p>
              )}
            </div>
          )}
        </div>

        {/* HISTÓRICO RECENTE */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
            <h2 className="text-2xl font-bold text-black flex items-center gap-3">
              Recentes
              <span className="text-xs font-bold text-white bg-black px-2.5 py-1 rounded-full">{historico.length}</span>
            </h2>
            <Link href="/historico" className="text-xs font-bold text-zinc-500 hover:text-black hover:underline uppercase tracking-wide transition-colors">
              Ver Histórico Completo &rarr;
            </Link>
          </div>

          <div className="grid gap-8">
            {historico.slice(0, 3).map((doc) => (
              <div key={doc.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-xl hover:border-zinc-300 transition-all duration-300 relative group ring-1 ring-zinc-50">

                {/* Indicador lateral */}
                <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-zinc-100 group-hover:bg-black transition-colors rounded-r-full"></div>


                <div className="flex flex-col gap-6 pl-5">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-center justify-between pr-8">
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg truncate max-w-md" title={doc.fileName}>
                        {doc.fileName}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-1 uppercase tracking-wide">
                        ID: <span className="text-zinc-600 font-bold">#{doc.id}</span> • {new Date(doc.createdAt).toLocaleDateString('pt-BR')} às {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* CONTEÚDO (OCR e IA) */}
                  <div className="grid md:grid-cols-2 gap-6">

                    {/* OCR */}
                    <div className="flex-1 bg-white border border-zinc-300 p-5 rounded-lg shadow-sm group-hover:border-zinc-400 transition-colors">
                      <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
                        <h4 className="text-[10px] uppercase tracking-widest text-black font-extrabold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-black"></span> Transcrição OCR
                        </h4>

                        {/* BOTAO COPIAR */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(doc.ocrText || "");
                            alert("Texto copiado para a área de transferência!");
                          }}
                          className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-md transition-all"
                          title="Copiar Transcrição"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-xs font-mono text-zinc-900 leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {doc.ocrText || "---"}
                      </p>
                    </div>

                    {/* IA */}
                    <div className="flex-1 bg-zinc-50 border border-zinc-100 p-5 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between mb-3 border-b border-zinc-100 pb-2">
                        <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                          Análise IA
                        </h4>

                        {/* BOTÃO COPIAR */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(doc.llmSummary || "");
                          }}
                          className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-200 rounded-md transition-all active:scale-95"
                          title="Copiar análise"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-sm text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap break-words max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {doc.llmSummary || "Processando análise inteligente..."}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {historico.length === 0 && (
              <div className="py-16 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-zinc-400 text-sm font-medium">Nenhum documento processado recentemente.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}