import { useEffect, useState } from 'react';
import api from '../api/axios';
import { DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contasRes, transacoesRes] = await Promise.all([
          api.get('/contas'),
          api.get('/transacoes')
        ]);

        const contas = contasRes.data;
        const transacoes = transacoesRes.data;

        setTransacoes(transacoes);

        const totalSaldoInicial = contas.reduce((acc, conta) => acc + conta.saldoInicial, 0);

        const totalFinal = transacoes.reduce((acc, t) => 
          t.tipo === 'RECEITA' ? acc + t.valor : acc - t.valor, 
          totalSaldoInicial
        );

        setSaldo(totalFinal);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard", error);
      }
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
      </div>
    </div>
  );
}