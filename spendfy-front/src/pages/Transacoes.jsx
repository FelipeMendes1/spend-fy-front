import { useState, useEffect, useRef } from 'react';
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
  FileDown,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';

export default function Transacoes() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, transacao: null });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [transacoesRes, contasRes] = await Promise.all([
        api.get('/transacoes'),
        api.get('/contas')
      ]);
      setTransacoes(transacoesRes.data);
      setContas(contasRes.data);
    } catch (err) {
      setError('Erro ao carregar dados das transações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async (formato) => {
    setIsExportOpen(false);
    try {
      const response = await api.get(`/relatorios/${formato}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-spendfy.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(`Erro ao gerar o arquivo ${formato.toUpperCase()}.`);
    }
  };

  const totalReceitas = transacoes
    .filter((t) => t.tipo === 'RECEITA')
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === 'DESPESA')
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const saldoTotal = contas.reduce((acc, c) => acc + (c.saldoAtual || 0), 0);

  const transacoesFiltradas = transacoes.filter((t) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (t.descricao || '').toLowerCase().includes(term) ||
      (t.nomeCategoria || '').toLowerCase().includes(term) ||
      (t.nomeConta || '').toLowerCase().includes(term)
    );
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.transacao) return;
    setDeleting(true);
    try {
      await api.delete(`/transacoes/${deleteModal.transacao.id}`);
      setSuccessMsg('Transação excluída com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setDeleteModal({ open: false, transacao: null });
      fetchData();
    } catch (err) {
      setError('Erro ao excluir transação.');
      setDeleteModal({ open: false, transacao: null });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
            <p className="text-sm text-gray-500">Visualize e exporte suas movimentações</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 bg-green-600 border border-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              <FileDown size={18} className="text-white-600" />
              Exportar
              <ChevronDown size={16} className={`transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Formatos disponíveis</div>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <FileSpreadsheet size={18} className="text-green-600" />
                  Relatório em CSV
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <FileText size={18} className="text-red-500" />
                  Relatório em PDF
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/transacoes/nova')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={18} />
            Nova Transação
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-medium uppercase mb-1 tracking-wider">Receitas</p>
          <h2 className="text-xl font-bold text-green-600">{formatCurrency(totalReceitas)}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-medium uppercase mb-1 tracking-wider">Despesas</p>
          <h2 className="text-xl font-bold text-red-600">{formatCurrency(totalDespesas)}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-medium uppercase mb-1 tracking-wider">Saldo Total</p>
          <h2 className={`text-xl font-bold ${saldoTotal >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(saldoTotal)}
          </h2>
        </div>
      </div>
      {successMsg && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2"><Check size={16}/> {successMsg}</div>}
      {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Filtrar por descrição, categoria ou conta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
        />
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : transacoesFiltradas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          Nenhuma transação encontrada.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Data</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Descrição</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Categoria / Conta</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Valor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(t.data)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{t.descricao}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">{t.nomeCategoria}</span>
                      <span className="text-xs text-gray-400 italic">{t.nomeConta}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.tipo === 'RECEITA' ? '+' : '-'} {formatCurrency(t.valor)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/transacoes/editar/${t.id}`)} className="p-2 text-gray-400 hover:text-blue-600"><Pencil size={18} /></button>
                      <button onClick={() => setDeleteModal({ open: true, transacao: t })} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
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
        message={`Deseja excluir a transação "${deleteModal.transacao?.descricao}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ open: false, transacao: null })}
        loading={deleting}
      />
    </div>
  );
}