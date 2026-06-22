import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicMenu from './pages/PublicMenu';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminHome from './pages/AdminHome';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicMenu />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminDashboard>
              <AdminHome />
            </AdminDashboard>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <AdminDashboard>
              <AdminProducts />
            </AdminDashboard>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <AdminDashboard>
              <AdminCategories />
            </AdminDashboard>
          }
        />
        <Route
          path="/admin/configuracion"
          element={
            <AdminDashboard>
              <AdminSettings />
            </AdminDashboard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
