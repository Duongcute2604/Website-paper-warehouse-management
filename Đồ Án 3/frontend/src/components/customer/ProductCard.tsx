import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=Kho+Giấy';

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const outOfStock = product.currentStock === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative">
        <img
          src={product.images[0] ?? PLACEHOLDER}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        {outOfStock && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Hết hàng
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-blue-600 font-medium mb-1">{product.category.name}</p>
        <h3 className="text-gray-900 font-semibold text-sm leading-snug mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-600 font-bold text-base">
            {product.price.toLocaleString('vi-VN')} đ
            <span className="text-gray-400 font-normal text-xs">/{product.unit}</span>
          </span>
          <span className={`text-xs ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
            {outOfStock ? 'Hết hàng' : `Còn ${product.currentStock} ${product.unit}`}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => !outOfStock && addItem(product)}
            disabled={outOfStock}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              outOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Thêm vào giỏ
          </button>
          <Link
            to={`/products/${product._id}`}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
