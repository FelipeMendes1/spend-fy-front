import { useEffect, useState } from 'react';
import api from '../api/axios';
import { DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/transacoes');
      setTransacoes(response.data);
      
      const total = response.data.reduce((acc, t) => 
        t.tipo === 'RECEITA' ? acc + t.valor : acc - t.valor, 0
      );
      setSaldo(total);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Resumo Financeiro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><DollarSign /></div>
            <div>
              <p className="text-gray-500 text-sm">Saldo Total</p>
              <h2 className="text-xl font-bold">R$ {saldo.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        {/* Adicionar cards similares para Receitas e Despesas totais */}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
              <tr key={t.id} className="border-b border-gray-50 last:border-none">
                <td className="px-6 py-4">{t.descricao}</td>
                <td className="px-6 py-4">{t.categoriaNome}</td>
                <td className={`px-6 py-4 font-medium ${t.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.tipo === 'RECEITA' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(t.data).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}