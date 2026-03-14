import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const navLinks = [
  { to: '/', label: 'Trang Chủ' },
  { to: '/order-tracking', label: 'Tra Cứu Đơn Hàng' },
];

export default function CustomerLayout() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <span>🏭</span>
              <span>Kho Giấy</span>
            </Link>

            {/* Nav */}
            <nav className="hidden sm:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Cart icon */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile nav */}
          <div className="sm:hidden flex gap-4 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium ${
                  location.pathname === link.to ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
              <span>🏭</span>
              <span>Kho Giấy</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Kho Giấy. Cung cấp giấy, vải vụn, lõi ống chất lượng cao.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>📞 0901 234 567</span>
              <span>📧 info@khogiay.vn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
