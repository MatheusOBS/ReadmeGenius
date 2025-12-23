import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ReadmeEditor } from './components/ReadmeEditor';
import { confetti } from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [repoPath, setRepoPath] = useState('');
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [importFlag, setImportFlag] = useState(0); // Flag to notify child

  const fetchGithubData = async () => {
    if (!repoPath.trim()) return;
    setIsFetchingRepo(true);
    try {
      const cleanPath = repoPath.replace('https://github.com/', '').replace(/\/$/, '');
      const response = await fetch(`https://api.github.com/repos/${cleanPath}`);
      
      if (!response.ok) throw new Error('Repo não encontrado');
      const repoData = await response.json();
      
      const saved = localStorage.getItem('readme-genius-v2-data');
      const currentData = saved ? JSON.parse(saved) : {};
      
      const newData = {
        ...currentData,
        projectName: repoData.name || '',
        tagline: repoData.description?.substring(0, 100) || '',
        description: repoData.description || '',
        techStack: repoData.language || '',
        license: repoData.license?.spdx_id || 'MIT'
      };
      
      localStorage.setItem('readme-genius-v2-data', JSON.stringify(newData));
      
      setIsImportModalOpen(false);
      setRepoPath('');
      toast.success('Repositório importado com sucesso!');
      setImportFlag(prev => prev + 1); // Trigger update in Editor
      
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      toast.error('Erro na importação. Verifique o caminho.');
    } finally {
      setIsFetchingRepo(false);
    }
  };

  return (
    <Layout 
      isImportModalOpen={isImportModalOpen}
      setIsImportModalOpen={setIsImportModalOpen}
      isFetchingRepo={isFetchingRepo}
      repoPath={repoPath}
      setRepoPath={setRepoPath}
      onImport={fetchGithubData}
    >
      <ReadmeEditor key={importFlag} />
      <Toaster position="bottom-right" />
    </Layout>
  );
};

export default App;
