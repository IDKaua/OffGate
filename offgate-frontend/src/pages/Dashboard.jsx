import React, { useState, useEffect } from 'react';
import { Shield, UserMinus, Plus, Code2, Cloud, Calendar, CheckCircle2, Clock, X, Loader2 } from 'lucide-react';
import { freelancerService } from '../services/api';

export function Dashboard() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    } catch (error) {
      alert('Erro ao salvar contrato. Verifique o console do navegador ou do Java.');
    }
  };

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

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Offboarding Schedule</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-dark-700 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white">Active Access Contracts</h2>
            <span className="text-xs px-2.5 py-1 bg-dark-700 text-gray-300 rounded-full">
              {freelancers.length} monitored
            </span>
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
                  {freelancers.map((item) => (
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
                        {item.isRevoked ? (
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
                        {!item.isRevoked && (
                          <button 
                            title="Revoke access immediately"
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-dark-700">
              <h3 className="text-base font-semibold text-white">Schedule New Offboarding</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full mt-1 bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full mt-1 bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-400">GitHub User</label>
                  <input 
                    type="text" 
                    required
                    value={formData.githubUsername}
                    onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                    className="w-full mt-1 bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400">AWS IAM User</label>
                  <input 
                    type="text" 
                    value={formData.awsIamUser}
                    onChange={(e) => setFormData({...formData, awsIamUser: e.target.value})}
                    className="w-full mt-1 bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400">Revocation Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.offboardingDate}
                  onChange={(e) => setFormData({...formData, offboardingDate: e.target.value})}
                  className="w-full mt-1 bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}