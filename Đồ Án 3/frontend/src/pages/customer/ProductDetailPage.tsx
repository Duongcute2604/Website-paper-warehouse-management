import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../../services/api';
import { useCart } from '../../contexts/CartContext';

const PLACEHOLDER = 'https://placehold.co/600x450/f3f4f6/9ca3af?text=Kho+Giấy';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => mockApi.getProduct(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-xl h-96" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm</p>
        <Link to="/" className="text-blue-600 hover:underline">← Quay lại trang chủ</Link>
      </div>
    );
  }

  const outOfStock = product.currentStock === 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Trang Chủ</Link>
        <span>/</span>
        <span className="text-blue-600">{product.category.name}</span>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div>
          <img
            src={product.images[0] ?? PLACEHOLDER}
            alt={product.name}
            className="w-full rounded-xl border border-gray-200 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
          />
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-blue-600 font-medium mb-1">{product.category.name}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>

          {/* Price */}
          <div className="bg-blue-50 rounded-xl p-4 mb-5">
            <p className="text-3xl font-bold text-blue-600">
              {product.price.toLocaleString('vi-VN')} đ
              <span className="text-base font-normal text-gray-500">/{product.unit}</span>
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
              <span className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
              {outOfStock ? 'Hết hàng' : `Còn ${product.currentStock} ${product.unit} trong kho`}
            </span>
          </div>

          {/* Quantity */}
          {!outOfStock && (
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm text-gray-600 font-medium">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.currentStock}
                  value={quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(product.currentStock, Math.max(1, v)));
                  }}
                  className="w-16 text-center py-2 text-sm border-x border-gray-200 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(product.currentStock, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">{product.unit}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                outOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {added ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
            </button>
            <button
              onClick={() => { addItem(product, quantity); navigate('/cart'); }}
              disabled={outOfStock}
              className="px-5 py-3 rounded-xl font-semibold text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
          </div>

          {/* Specs */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Thông số kỹ thuật</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {Object.entries(product.specifications).map(([key, val], i) => (
                  <div
                    key={key}
                    className={`flex text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <span className="w-1/2 px-4 py-2.5 text-gray-500 font-medium border-r border-gray-200">{key}</span>
                    <span className="w-1/2 px-4 py-2.5 text-gray-900">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
