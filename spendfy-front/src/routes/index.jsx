import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Transacoes from '../pages/Transacoes';
import TransactionForm from '../pages/TransactionForm';
import Categorias from '../pages/Categorias';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Grupo de Rotas Privadas */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="/transacoes/nova" element={<TransactionForm />} />
          <Route path="/transacoes/editar/:id" element={<TransactionForm />} />
          <Route path="/categorias" element={<Categorias />} />
          {/* Adicione novas rotas privadas aqui */}
        </Route>
      </Route>

      {/* Redirecionamento padrão */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
