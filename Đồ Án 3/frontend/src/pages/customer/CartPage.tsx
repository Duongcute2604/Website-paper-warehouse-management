import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const PLACEHOLDER = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=SP';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Giỏ hàng <span className="text-gray-400 font-normal text-lg">({totalItems} sản phẩm)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
              <img
                src={product.images[0] ?? PLACEHOLDER}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 mb-0.5">{product.category.name}</p>
                <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                <p className="text-blue-600 font-bold text-sm mt-1">
                  {product.price.toLocaleString('vi-VN')} đ/{product.unit}
                </p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity control */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e: { target: { value: string } }) => {
                        const v = parseInt(e.target.value) || 1;
                        updateQuantity(product._id, Math.max(1, v));
                      }}
                      className="w-12 text-center py-1 text-sm border-x border-gray-200 focus:outline-none"
                    />
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 text-sm">
                      {(product.price * quantity).toLocaleString('vi-VN')} đ
                    </span>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span>{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span>Tính khi thanh toán</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-blue-600">{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Tiến hành đặt hàng →
            </Link>
            <Link
              to="/"
              className="block w-full text-center text-sm text-gray-500 mt-3 hover:text-blue-600"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
