"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Documento {
  id: number;
  fileName: string;
  ocrText: string;
  llmSummary: string;
  createdAt: string;
}

export default function HistoricoCompleto() {
  const [historico, setHistorico] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    async function carregarTudo() {
      try {
        const res = await fetch(`${API_URL}/documents`, { cache: 'no-store' });
        const data = await res.json();
        setHistorico(data);
      } catch (error) {
        console.error("Erro ao buscar", error);
      } finally {
        setLoading(false);
      }
    }
    carregarTudo();
  }, [API_URL]);

  const documentosFiltrados = historico.filter((doc) => {
    const textoBusca = busca.toLowerCase();
    return doc.fileName.toLowerCase().includes(textoBusca) || doc.id.toString().includes(textoBusca);
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text || "");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
       
       <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link 
                href="/" 
                className="flex items-center gap-2 text-xs md:text-sm font-medium text-white border border-zinc-700 bg-zinc-900/50 px-4 py-2 rounded-full hover:bg-zinc-800 hover:border-zinc-500 transition-all group"
            >
                <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
                Voltar
            </Link>
          
          <div className="flex items-center gap-3 select-none">
             <div className="flex items-center gap-1 opacity-90">
                <img src="/logo.png" alt="Paggo" className="h-6 w-auto object-contain brightness-0 invert" />
                <span className="text-white font-bold text-lg tracking-[0.2em] uppercase pl-2 border-l border-zinc-700 ml-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    paggo-OCR
                </span>
             </div>
             <span className="text-zinc-500 text-sm border-l border-zinc-700 pl-3 hidden sm:block">Histórico</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8 md:flex items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-black tracking-tight">Todos os Documentos</h1>
                <p className="text-zinc-500 mt-1">Gestão completa e visualização detalhada.</p>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 mb-8">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nome do arquivo ou ID..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-lg leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-shadow"
                />
            </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-400 animate-pulse">Carregando dados...</div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {documentosFiltrados.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-all group">
                
                <div className="flex flex-col md:flex-row justify-between md:items-start border-b border-zinc-100 pb-6 mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">{doc.fileName}</h2>
                    <p className="text-sm text-zinc-400 mt-1 uppercase font-semibold tracking-wide">
                      Processado em {new Date(doc.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-zinc-100 text-zinc-600 text-sm font-bold font-mono py-1.5 px-4 rounded border border-zinc-200 h-fit">
                    #{doc.id}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* --- OCR COM BOTÃO DE CÓPIA --- */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
                        <h3 className="text-xs font-bold text-black uppercase flex items-center gap-2 tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-black"></span> Transcrição OCR
                        </h3>
                        <button
                            onClick={() => handleCopy(doc.ocrText)}
                            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-md transition-all active:scale-95"
                            title="Copiar Transcrição"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-sm text-zinc-900 font-mono bg-white p-6 rounded border border-zinc-300 whitespace-pre-wrap h-80 overflow-y-auto shadow-sm">
                      {doc.ocrText || "---"}
                    </div>
                  </div>

                  {/* BOTÃO DE CÓPIA */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-100 pb-2">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Análise IA
                        </h3>
                        <button
                            onClick={() => handleCopy(doc.llmSummary)}
                            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-md transition-all active:scale-95"
                            title="Copiar Análise"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-base text-zinc-700 leading-relaxed bg-zinc-50 p-6 rounded border border-zinc-200 whitespace-pre-wrap h-80 overflow-y-auto">
                      {doc.llmSummary || "Sem análise disponível."}
                    </div>
                  </div>

                </div>
              </div>
            ))}
            
            {!loading && documentosFiltrados.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl">
                    <p className="text-zinc-400">Nenhum documento encontrado.</p>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}