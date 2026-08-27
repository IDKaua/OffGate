import React, { useState, useEffect } from 'react';
import { Shield, Wrench, Plus, GitBranch, Code2, Calendar, CheckCircle2, AlertTriangle, X, Loader2, Search, Trash2, LogOut, Activity, MessageSquare, GitPullRequest, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { repositoryService } from '../services/api'; 

const getBrowserLang = () => {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language.startsWith('pt') ? 'pt' : 'en';
};

export function Dashboard({ onLogout }) {
  const [lang, setLang] = useState('en');
  useEffect(() => { setLang(getBrowserLang()); }, []);

  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [commitData, setCommitData] = useState({ message: '', branch: '' });
  
  // Estados do fluxo de IA
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [awaitingReview, setAwaitingReview] = useState(false); 

  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false); 

  const [formData, setFormData] = useState({
    repoName: '', repoUrl: '', targetBranch: '', techStack: '', dateAdded: '', isHealthy: false 
  });

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const data = await repositoryService.getAll();
      setRepositories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRepositories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dateAdded: formData.dateAdded || new Date().toISOString().split('T')[0],
        repoUrl: formData.repoUrl || `https://github.com/${formData.repoName}`
      };

      await repositoryService.create(payload);
      
      setIsModalOpen(false);
      setFormData({ repoName: '', repoUrl: '', targetBranch: '', techStack: '', dateAdded: '', isHealthy: false });
      fetchRepositories();
      toast.success('Repositório conectado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao conectar.');
    }
  };

  const handleGithubSearch = async () => {
    if (!formData.repoName) {
      toast.error('Digite o nome do repositório primeiro (Ex: IDKaua/Ecossistema)');
      return;
    }
    
    const toastId = toast.loading('Procurando nos servidores do GitHub...');
    try {
      const response = await fetch(`https://api.github.com/repos/${formData.repoName}`);
      if (!response.ok) throw new Error('Não encontrado');
      
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        repoUrl: data.html_url,
        targetBranch: data.default_branch,
        techStack: data.language || 'Múltiplas',
        dateAdded: new Date().toISOString().split('T')[0] 
      }));
      
      toast.success('Repositório validado e mapeado!', { id: toastId });
    } catch (error) {
      toast.error('Não encontrado. Verifique se o nome está correto ou se é Privado.', { id: toastId });
    }
  };

  const openPromptModal = (id) => {
    setSelectedRepoId(id);
    setAiPrompt('');
    setIsPromptModalOpen(true);
  };

  // FUNÇÃO CORRIGIDA AQUI!
  const triggerRepairSimulation = async () => {
    setIsPromptModalOpen(false); 
    setIsTerminalOpen(true);
    setIsSimulating(true);
    setAwaitingReview(false);
    
    setTerminalLogs([
      '⚡ [OffGate AI Engine] Inicializando clonagem do repositório em sandbox...',
      `📥 Lendo instruções: "${aiPrompt || 'Otimização padrão'}"`,
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '🔍 Analisando AST (Abstract Syntax Tree)...']);
    }, 1500);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '⚠️ Vulnerabilidade/Anti-pattern encontrado no Controller.']);
      setTerminalLogs(prev => [...prev, '🧠 Gerando patch corretivo usando LLM...']);
    }, 3500);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '⏸️ [OffGate Core] Patch gerado. Aguardando aprovação humana (Code Review)...']);
      setIsSimulating(false);
      setAwaitingReview(true); 
      
      // Prepara o formulário de commit com dados iniciais
      const repo = repositories.find(r => r.id === selectedRepoId);
      setCommitData({ 
        message: `fix: correção baseada em instrução da IA`, 
        branch: repo?.targetBranch || 'main' 
      });
    }, 5500);
  };

  const approveAndPush = async () => {
    setIsDiffModalOpen(false);
    setIsTerminalOpen(true);
    setAwaitingReview(false);
    setIsSimulating(true);

    setTerminalLogs(prev => [...prev, '✅ Patch aprovado pelo usuário!']);
    setTerminalLogs(prev => [...prev, '🚀 Comitando código e enviando via GitHub API...']);

    try {
      const response = await fetch(`http://localhost:8080/api/repositories/${selectedRepoId}/repair`, { 
        method: 'PUT', 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('@OffGate:token')}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          commitMessage: commitData.message,
          branch: commitData.branch
        }) 
      });
      
      if (!response.ok) throw new Error('Falha no Java');
      
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, '✨ [SUCESSO] Push realizado e código atualizado!']);
        setIsSimulating(false);
        fetchRepositories();
      }, 2000);

    } catch (error) {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, '❌ ERRO: Falha ao enviar para o GitHub.']);
        setIsSimulating(false);
      }, 2000);
    }
  };

  const handleDelete = (id) => {
    toast((tId) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-800">Desconectar repositório?</span>
        <div className="flex gap-2 mt-1">
          <button onClick={async () => {
              toast.dismiss(tId.id);
              await repositoryService.delete(id);
              fetchRepositories();
            }} className="bg-red-500 text-white px-3 py-1.5 rounded text-xs">Sim, Desconectar</button>
          <button onClick={() => toast.dismiss(tId.id)} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-xs">Cancelar</button>
        </div>
      </div>
    ));
  };

  const filteredRepos = repositories.filter(repo => {
    const safeName = repo.repoName || '';
    const safeSearch = searchTerm || '';
    const matchesSearch = safeName.toLowerCase().includes(safeSearch.toLowerCase());
    
    const isRepaired = repo.healthy || repo.isHealthy;
    
    if (activeTab === 'needs-repair') return matchesSearch && !isRepaired;
    if (activeTab === 'healthy') return matchesSearch && isRepaired;
    return matchesSearch; 
  });

  const totalRepos = repositories.length;
  const healthyRepos = repositories.filter(f => f.healthy || f.isHealthy).length;
  const buggyRepos = totalRepos - healthyRepos;

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 p-8 relative">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-8 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">OffGate</h1>
            <p className="text-xs text-gray-400">Automated Code Repair & Deep Analysis</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/20">
            <Plus className="w-4 h-4" /><span>Conectar Repositório</span>
          </button>
          <button onClick={onLogout} className="p-2.5 bg-dark-800 hover:bg-dark-700 text-gray-400 rounded-lg cursor-pointer border border-dark-700">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Repositórios Monitorados</p>
              <h3 className="text-2xl font-bold text-white">{totalRepos}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Código Saudável</p>
              <h3 className="text-2xl font-bold text-emerald-400">{healthyRepos}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Bugs / Requer Reparo</p>
              <h3 className="text-2xl font-bold text-amber-400">{buggyRepos}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-xl">
          
          <div className="p-6 border-b border-dark-700 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-base font-semibold text-white">Integrações Ativas</h2>
                <span className="text-xs px-2.5 py-1 bg-dark-700 text-gray-300 rounded-full">
                  {filteredRepos.length} conectados
                </span>
              </div>
              
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar repositório..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-2">
              <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === 'all' ? 'bg-dark-700 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'}`}>Todos</button>
              <button onClick={() => setActiveTab('needs-repair')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === 'needs-repair' ? 'bg-amber-500/10 text-amber-400' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'}`}>Requer Análise</button>
              <button onClick={() => setActiveTab('healthy')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'}`}>Saudáveis</button>
            </div>
          </div>

          {loading ? (
             <div className="p-12 flex justify-center text-gray-400"><Loader2 className="animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-700 text-xs text-gray-400 uppercase bg-dark-900/50">
                  <th className="py-4 px-6">Repositório</th>
                  <th className="py-4 px-6">Ambiente</th>
                  <th className="py-4 px-6">Status da IA</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700 text-sm">
                {filteredRepos.map((item) => (
                  <tr key={item.id} className="hover:bg-dark-700/30">
                    <td className="py-4 px-6">
                      <div className="font-medium text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-gray-400" />
                        {item.repoName}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center space-x-1 text-gray-300">
                        <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{item.targetBranch}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {(item.healthy || item.isHealthy) ? (
                        <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs">Saudável</span>
                      ) : (
                        <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full text-xs">Bugs Detectados</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        {!(item.healthy || item.isHealthy) && (
                          <button onClick={() => openPromptModal(item.id)} className="p-2 text-indigo-400 bg-indigo-500/10 rounded-lg border border-indigo-500/30 cursor-pointer hover:bg-indigo-600 hover:text-white transition-all">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 rounded-lg cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL: PROMPT DA IA */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-dark-800 border border-indigo-500/40 rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center pb-4 border-b border-dark-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Instruções para o OffGate AI</h3>
                  <p className="text-xs text-gray-400">O que você deseja que a IA foque no reparo?</p>
                </div>
              </div>
              <button onClick={() => setIsPromptModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 mt-4 text-sm text-white h-32 focus:outline-none focus:border-indigo-500" placeholder="Ex: Analisar vulnerabilidades no módulo de autenticação..."></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsPromptModalOpen(false)} className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded cursor-pointer">Cancelar</button>
              <button onClick={triggerRepairSimulation} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer flex items-center gap-2">
                <Wrench className="w-4 h-4" /> Gerar Solução
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORMULÁRIO DE CONEXÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-dark-700">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-gray-300" />
                <h3 className="text-base font-semibold text-white">Conectar Repositório</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-400">Nome do Repositório (Dono/Projeto)</label>
                <div className="flex mt-1 space-x-2">
                  <input 
                    type="text" required 
                    value={formData.repoName} 
                    onChange={(e) => setFormData({...formData, repoName: e.target.value})} 
                    className="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" 
                    placeholder="Ex: facebook/react" 
                  />
                  <button 
                    type="button" 
                    onClick={handleGithubSearch} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-600/20"
                    title="Buscar dados no GitHub"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-400">Branch Alvo</label>
                  <input type="text" required value={formData.targetBranch} onChange={(e) => setFormData({...formData, targetBranch: e.target.value})} className="w-full mt-1 bg-dark-900/50 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none" placeholder="Auto" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400">Stack Principal</label>
                  <input type="text" value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} className="w-full mt-1 bg-dark-900/50 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none" placeholder="Auto" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-dark-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-dark-700 text-gray-300 rounded-lg text-sm cursor-pointer hover:bg-dark-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-emerald-500">Salvar Conexão</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TERMINAL HACKER */}
      {isTerminalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-indigo-500/30 rounded-xl max-w-2xl w-full p-6 font-mono">
            <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-indigo-400 ml-2">offgate-ai-engine — 80x24</span>
              </div>
            </div>
             <div className="space-y-2 text-xs text-indigo-300 h-[200px] overflow-y-auto">
              {terminalLogs.map((log, index) => (
                <div key={index}>&gt; <span className={log.includes('ERRO') ? 'text-red-400' : log.includes('SUCESSO') ? 'text-emerald-400 font-bold' : log.includes('⏸️') ? 'text-amber-400' : ''}>{log}</span></div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-xs">
              <span className="text-gray-500">
                {isSimulating ? <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin text-indigo-400" /> Processando...</span> : 'Status: Aguardando.'}
              </span>
              
              <div className="flex gap-2">
                {awaitingReview && (
                  <button onClick={() => { setIsTerminalOpen(false); setIsDiffModalOpen(true); }} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-600/20">
                    <GitPullRequest className="w-4 h-4" /> Ver Código Gerado
                  </button>
                )}
                {!isSimulating && !awaitingReview && (
                  <button onClick={() => setIsTerminalOpen(false)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded cursor-pointer">Fechar Terminal</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISUALIZADOR DE DIFF COM FORMULÁRIO DE COMMIT INCLUSO */}
      {isDiffModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[70]">
          <div className="bg-dark-900 border border-gray-700 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col h-[80vh]">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-dark-800 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <GitPullRequest className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Revisão de Patch (Diff)</h3>
                  <p className="text-xs text-gray-400">src/controllers/UserController.java</p>
                </div>
              </div>
              <button onClick={() => setIsDiffModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-sm">
              <div className="bg-red-950/30 text-red-300/80 px-4 py-1 flex">
                <span className="w-8 text-right pr-4 text-gray-600 select-none">- 42</span>
                <span>{'// Código original vulnerável'}</span>
              </div>
              <div className="bg-red-950/30 text-red-400 px-4 py-1 flex">
                <span className="w-8 text-right pr-4 text-gray-600 select-none">- 43</span>
                <span className="line-through decoration-red-500/50">{'String query = "SELECT * FROM users WHERE email = \'" + email + "\'";'}</span>
              </div>
              
              <div className="bg-emerald-950/30 text-emerald-300/80 px-4 py-1 flex mt-2">
                <span className="w-8 text-right pr-4 text-gray-600 select-none">+ 42</span>
                <span>{'// Correção sugerida pelo OffGate AI (Prevenção de SQL Injection)'}</span>
              </div>
              <div className="bg-emerald-950/30 text-emerald-400 px-4 py-1 flex">
                <span className="w-8 text-right pr-4 text-gray-600 select-none">+ 43</span>
                <span>{'String query = "SELECT * FROM users WHERE email = ?";'}</span>
              </div>
              <div className="bg-emerald-950/30 text-emerald-400 px-4 py-1 flex">
                <span className="w-8 text-right pr-4 text-gray-600 select-none">+ 44</span>
                <span>{'PreparedStatement pstmt = connection.prepareStatement(query);'}</span>
              </div>
              <div className="bg-emerald-950/30 text-emerald-400 px-4 py-1 flex">
                <span className="w-8 text-right pr-4 text-gray-600 select-none">+ 45</span>
                <span>{'pstmt.setString(1, email);'}</span>
              </div>
            </div>

            {/* AQUI ESTÁ O NOVO FORMULÁRIO DE COMMIT EMBUTIDO! */}
            <div className="p-4 border-t border-gray-800 bg-dark-800 rounded-b-xl flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-400">Mensagem do Commit</label>
                  <input 
                    type="text" 
                    value={commitData.message}
                    onChange={(e) => setCommitData({...commitData, message: e.target.value})}
                    className="w-full mt-1 bg-dark-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-medium text-gray-400">Branch de Destino</label>
                  <input 
                    type="text" 
                    value={commitData.branch}
                    onChange={(e) => setCommitData({...commitData, branch: e.target.value})}
                    className="w-full mt-1 bg-dark-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    Alvo: <strong className="text-gray-300">
                      {repositories.find(r => r.id === selectedRepoId)?.repoName || 'Repositório'}
                    </strong>
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => { setIsDiffModalOpen(false); setIsTerminalOpen(true); }} className="px-4 py-2 bg-dark-700 text-gray-300 rounded-lg text-sm cursor-pointer hover:bg-dark-600 transition-colors">
                    Rejeitar Sugestão
                  </button>
                  <button onClick={approveAndPush} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm cursor-pointer hover:bg-emerald-500 flex items-center gap-2 font-medium shadow-lg shadow-emerald-600/20 transition-all">
                    <Check className="w-4 h-4" /> Aprovar e Fazer Push
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}