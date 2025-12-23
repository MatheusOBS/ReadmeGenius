import React from 'react';
import { Sparkles, Github, Shield, Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isFetchingRepo: boolean;
  repoPath: string;
  setRepoPath: (path: string) => void;
  onImport: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  isImportModalOpen, 
  setIsImportModalOpen,
  isFetchingRepo,
  repoPath,
  setRepoPath,
  onImport
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/40 pb-12">
      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => !isFetchingRepo && setIsImportModalOpen(false)}></div>
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)] relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">GitHub Sync</h3>
                <p className="text-xs text-zinc-500">Auto-detectamos sua stack.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Path do Repo</label>
                <input 
                  value={repoPath}
                  onChange={(e) => setRepoPath(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onImport()}
                  placeholder="usuario/projeto"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none transition-all"
                />
              </div>
              <button 
                onClick={onImport}
                disabled={isFetchingRepo || !repoPath}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
              >
                {isFetchingRepo ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sincronizar Agora'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="h-20 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1500px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">Readme<span className="text-indigo-400">Genius</span></h1>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Engine de Documentação</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
             <button 
                onClick={() => setIsImportModalOpen(true)}
                className="hidden sm:flex items-center gap-2 text-xs font-black bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-5 py-3 rounded-xl transition-all active:scale-95 shadow-lg"
             >
               <Github className="w-4 h-4" /> Importar Repo
             </button>
             <div className="w-px h-6 bg-zinc-900" />
             <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] mr-2 animate-pulse" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status: Online</span>
             </div>
          </div>
        </div>
      </nav>

      {children}

      <footer className="max-w-[1500px] mx-auto px-8 mt-20 text-center">
         <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-900 to-transparent mb-12" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-600">
            <p className="text-xs font-medium">© 2025 ReadmeGenius. A próxima geração de documentação técnica.</p>
         </div>
      </footer>
    </div>
  );
};
