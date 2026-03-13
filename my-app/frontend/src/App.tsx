import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CashierPage from './pages/CashierPage';
import KitchenPage from './pages/KitchenPage';
import ReportsPage from './pages/ReportsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cashier" element={<CashierPage />} />
      <Route path="/kitchen" element={<KitchenPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
