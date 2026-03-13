import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import {
  Plus,
  Trash2,
  Pencil,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowUpRight,
  Search,
  Check,
} from 'lucide-react';

export default function Transacoes() {
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalSaldoInicial, setTotalSaldoInicial] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ open: false, transacao: null });
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [transacoesRes, contasRes] = await Promise.all([
        api.get('/transacoes'),
        api.get('/contas')
      ]);
      
      setTransacoes(transacoesRes.data);
      
      const inicial = contasRes.data.reduce((acc, conta) => acc + (conta.saldoInicial || 0), 0);
      setTotalSaldoInicial(inicial);

    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const totalReceitas = transacoes
    .filter((t) => t.tipo === 'RECEITA')
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === 'DESPESA')
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const saldoTotal = totalSaldoInicial + totalReceitas - totalDespesas;

  const transacoesFiltradas = transacoes.filter((t) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (t.descricao || '').toLowerCase().includes(term) ||
      (t.categoriaNome || t.nomeCategoria || '').toLowerCase().includes(term) ||
      (t.tipo || '').toLowerCase().includes(term) ||
      (t.observacao || '').toLowerCase().includes(term)
    );
  });

  const handleDeleteClick = (transacao) => {
    setDeleteModal({ open: true, transacao });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.transacao) return;

    setDeleting(true);
    try {
      await api.delete(`/transacoes/${deleteModal.transacao.id}`);
      showSuccess('Transação excluída com sucesso!');
      setDeleteModal({ open: false, transacao: null });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir transação.');
      setDeleteModal({ open: false, transacao: null });
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
            <p className="text-sm text-gray-500">
              Visualize e gerencie todas as suas movimentações
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/transacoes/nova')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} />
          Nova Transação
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-full text-green-600">
              <ArrowUpCircle size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Receitas</p>
              <h2 className="text-lg font-bold text-green-600">{formatCurrency(totalReceitas)}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 rounded-full text-red-600">
              <ArrowDownCircle size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Despesas</p>
              <h2 className="text-lg font-bold text-red-600">{formatCurrency(totalDespesas)}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${saldoTotal >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
              <ArrowUpRight size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Saldo Total</p>
              <h2 className={`text-lg font-bold ${saldoTotal >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(saldoTotal)}
              </h2>
            </div>
          </div>
        </div>
      </div>
      {successMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por descrição, categoria, tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Tipo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Descrição</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Categoria</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Data</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Valor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {t.tipo === 'RECEITA' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                        <ArrowUpCircle size={14} /> Receita
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                        <ArrowDownCircle size={14} /> Despesa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{t.descricao || '—'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.categoriaNome || t.nomeCategoria || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(t.data)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${t.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.tipo === 'RECEITA' ? '+ ' : '- '} {formatCurrency(t.valor)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/transacoes/editar/${t.id}`)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(t)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Excluir Transação"
        message={`Tem certeza que deseja excluir a transação "${deleteModal.transacao?.descricao}" no valor de ${formatCurrency(deleteModal.transacao?.valor)}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ open: false, transacao: null })}
        loading={deleting}
      />
    </div>
  );
}