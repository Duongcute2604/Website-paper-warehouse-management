import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/customer/HomePage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import InventoryPage from './pages/admin/InventoryPage';
import TransactionPage from './pages/admin/TransactionPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import SupplierManagementPage from './pages/admin/SupplierManagementPage';
import ExpenseManagementPage from './pages/admin/ExpenseManagementPage';
import ReportsPage from './pages/admin/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Customer routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
          </Route>

          {/* Admin login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin protected routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductManagementPage />} />
            <Route path="/admin/categories" element={<CategoryManagementPage />} />
            <Route path="/admin/inventory" element={<InventoryPage />} />
            <Route path="/admin/transactions" element={<TransactionPage />} />
            <Route path="/admin/orders" element={<OrderManagementPage />} />
            <Route path="/admin/suppliers" element={<SupplierManagementPage />} />
            <Route path="/admin/expenses" element={<ExpenseManagementPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
