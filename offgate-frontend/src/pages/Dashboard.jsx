import React, { useState, useEffect } from 'react';
import { Shield, UserMinus, Plus, Code2, Cloud, Calendar, CheckCircle2, Clock, X, Loader2, Search, Trash2, LogOut, Users, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { freelancerService } from '../services/api';

export function Dashboard({ onLogout }) {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para o Terminal Simulador
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Estados para pesquisa e abas
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubUsername: '',
    awsIamUser: '',
    offboardingDate: '',
    isRevoked: false
  });

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const data = await freelancerService.getAll();
      setFreelancers(data);
    } catch (error) {
      console.error('Erro ao buscar freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await freelancerService.create(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        githubUsername: '',
        awsIamUser: '',
        offboardingDate: '',
        isRevoked: false
      });
      fetchFreelancers();
      toast.success('Contrato agendado com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar contrato.');
    }
  };

  const handleRevoke = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-800">Revogar acesso imediatamente?</span>
        <div className="flex gap-2 mt-1">
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              triggerTerminalSimulation(id);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Sim, Revogar
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // Função que simula o terminal de desprovisionamento
  const triggerTerminalSimulation = async (id) => {
    setIsTerminalOpen(true);
    setIsSimulating(true);
    setTerminalLogs([
      '⚡ [OffGate Engine] Initializing secure handshake with cloud providers...',
      '🔒 Establishing TLS tunnel to GitHub API v4...'
    ]);

    // Simula logs em tempo real
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '👤 Locating GitHub member identity and revoking PAT tokens... [OK]']);
    }, 800);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '☁️ Connecting to AWS IAM Identity Center (us-east-1)...']);
    }, 1600);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '🗑️ Detaching inline policies and deleting access keys... [OK]']);
    }, 2400);

    // Executa a requisição real no backend Java
    try {
      const response = await fetch(`http://localhost:8080/api/freelancers/${id}/revoke`, { method: 'PUT' });
      if (!response.ok) throw new Error('Falha no Java');
      
      setTimeout(() => {
        setTerminalLogs(prev => [
          ...prev, 
          'database: updated contract status to REVOKED [OK]',
          '✨ [OffGate Core] Deprovisioning pipeline completed successfully without errors.'
        ]);
        setIsSimulating(false);
        fetchFreelancers();
      }, 3200);

    } catch (error) {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, '❌ ERROR: Failed to communicate with OffGate backend API.']);
        setIsSimulating(false);
      }, 3200);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-800">Excluir permanentemente?</span>
        <div className="flex gap-2 mt-1">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await freelancerService.delete(id);
                fetchFreelancers();
                toast.success('Contrato excluído!');
              } catch (error) {
                toast.error('Erro ao excluir.');
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Sim, Excluir
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // Filtra os freelancers baseando-se na aba ativa e na busca
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = 
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isRevoked = freelancer.isRevoked || freelancer.revoked;
    if (activeTab === 'scheduled') return matchesSearch && !isRevoked;
    if (activeTab === 'revoked') return matchesSearch && isRevoked;
    return matchesSearch; 
  });

  const totalContracts = freelancers.length;
  const revokedAccesses = freelancers.filter(f => f.isRevoked || f.revoked).length;
  const pendingSchedules = totalContracts - revokedAccesses;

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 p-8">
      
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-8 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">OffGate</h1>
            <p className="text-xs text-gray-400">Automated Security & Access Deprovisioning</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Offboarding Schedule</span>
          </button>
          
          <button 
            onClick={onLogout}
            title="Sair do sistema"
            className="flex items-center justify-center p-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Total de Contratos</p>
              <h3 className="text-2xl font-bold text-white">{totalContracts}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Acessos Revogados</p>
              <h3 className="text-2xl font-bold text-emerald-400">{revokedAccesses}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Offboardings Pendentes</p>
              <h3 className="text-2xl font-bold text-amber-400">{pendingSchedules}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-xl">
          
          {/* Cabeçalho da Tabela com Barra de Pesquisa e Abas */}
          <div className="p-6 border-b border-dark-700 flex flex-col gap-4">
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-base font-semibold text-white">Access Contracts</h2>
                <span className="text-xs px-2.5 py-1 bg-dark-700 text-gray-300 rounded-full">
                  {filteredFreelancers.length} items
                </span>
              </div>
              
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Abas (Tabs) */}
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === 'all' ? 'bg-dark-700 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'}`}
              >
                All Contracts
              </button>
              <button 
                onClick={() => setActiveTab('scheduled')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === 'scheduled' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setActiveTab('revoked')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === 'revoked' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'}`}
              >
                Revoked
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center items-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Connecting to OffGate API...</span>
            </div>
          ) : freelancers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              No active contracts found. Click "New Offboarding Schedule" to add one.
            </div>
          ) : filteredFreelancers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              Nenhum contrato encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-700 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-dark-900/50">
                    <th className="py-4 px-6">Freelancer</th>
                    <th className="py-4 px-6">Integrations</th>
                    <th className="py-4 px-6">Revocation Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700 text-sm">
                  {filteredFreelancers.map((item) => (
                    <tr key={item.id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.email}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3 text-xs text-gray-300">
                          <span className="flex items-center space-x-1 bg-dark-700 px-2 py-1 rounded">
                            <Code2 className="w-3.5 h-3.5 text-gray-400" />
                            <span>{item.githubUsername}</span>
                          </span>
                          <span className="flex items-center space-x-1 bg-dark-700 px-2 py-1 rounded">
                            <Cloud className="w-3.5 h-3.5 text-amber-500" />
                            <span>{item.awsIamUser}</span>
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{item.offboardingDate}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {(item.isRevoked || item.revoked) ? (
                          <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Revoked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Scheduled</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          {!(item.isRevoked || item.revoked) && (
                            <button 
                              onClick={() => handleRevoke(item.id)}
                              title="Revoke access immediately"
                              className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleDelete(item.id)}
                            title="Delete contract permanently"
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal do Terminal Simulador */}
      {isTerminalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-emerald-500/30 rounded-xl max-w-2xl w-full p-6 shadow-2xl font-mono">
            
            {/* Cabeçalho do Terminal */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-400 ml-2">offgate-deprovisioning-cli — bash — 80x24</span>
              </div>
              {!isSimulating && (
                <button 
                  onClick={() => setIsTerminalOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer text-xs bg-gray-800 px-3 py-1 rounded"
                >
                  Fechar Janela
                </button>
              )}
            </div>

            {/* Corpo com as linhas de comando */}
            <div className="space-y-2 text-xs text-emerald-400 min-h-[160px] max-h-[250px] overflow-y-auto">
              {terminalLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-gray-600">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {isSimulating && (
                <div className="flex items-center space-x-2 animate-pulse text-amber-400">
                  <span>&gt;</span>
                  <span>Executing pipeline sequence...</span>
                </div>
              )}
            </div>

            {/* Rodapé do Terminal */}
            <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
              <span>Status: {isSimulating ? 'Running Pipeline...' : 'Completed'}</span>
              {!isSimulating && (
                <button
                  onClick={() => setIsTerminalOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-4 py-1.5 rounded transition-colors cursor-pointer"
                >
                  Concluído
                </button>
              )}
            </div>

          </div>
        </div>
      )}      
    </div>
  );
}