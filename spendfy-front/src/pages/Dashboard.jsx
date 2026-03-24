import { useEffect, useState } from 'react';
import api from '../api/axios';
import { DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [receitasTotais, setReceitasTotais] = useState(0);
  const [despesasTotais, setDespesasTotais] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contasRes, transacoesRes] = await Promise.all([
          api.get('/contas'),
          api.get('/transacoes')
        ]);

        const contas = contasRes.data;
        const transacoesData = transacoesRes.data;

        // Saldo total = soma do saldoAtual calculado pelo backend por conta
        const totalSaldo = contas.reduce((acc, conta) => acc + (conta.saldoAtual || 0), 0);

        const receitas = transacoesData
          .filter(t => t.tipo === 'RECEITA')
          .reduce((acc, t) => acc + t.valor, 0);

        const despesas = transacoesData
          .filter(t => t.tipo === 'DESPESA')
          .reduce((acc, t) => acc + t.valor, 0);

        setReceitasTotais(receitas);
        setDespesasTotais(despesas);
        setSaldo(totalSaldo);

        // Últimas 10 transações ordenadas por data decrescente
        const ultimas = [...transacoesData]
          .sort((a, b) => new Date(b.data) - new Date(a.data))
          .slice(0, 10);
        setTransacoes(ultimas);

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Resumo Financeiro</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Saldo Total</p>
              <h2 className="text-xl font-bold text-gray-900">R$ {saldo.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <ArrowUpCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Receitas</p>
              <h2 className="text-xl font-bold text-green-600">+ R$ {receitasTotais.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <ArrowDownCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Despesas</p>
              <h2 className="text-xl font-bold text-red-600">- R$ {despesasTotais.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Últimas Movimentações</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Descrição</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Categoria</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Valor</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Data</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-800">{t.descricao}</td>
                <td className="px-6 py-4 text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase font-medium">
                    {t.nomeCategoria}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${t.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.tipo === 'RECEITA' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(t.data + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}