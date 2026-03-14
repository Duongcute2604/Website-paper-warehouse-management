import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../../services/api';
import SearchBar from '../../components/customer/SearchBar';
import CategoryFilter from '../../components/customer/CategoryFilter';
import ProductCard from '../../components/customer/ProductCard';

const PAGE_SIZE = 6;

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: mockApi.getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, categoryId, page],
    queryFn: () => mockApi.getProducts({ search, categoryId, page, limit: PAGE_SIZE }),
  });

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleCategory = useCallback((id: string) => {
    setCategoryId(id);
    setPage(1);
  }, []);

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Kho Giấy Chất Lượng Cao</h1>
          <p className="text-blue-100 text-lg mb-6 max-w-xl">
            Cung cấp giấy in, vải vụn, lõi ống với giá tốt nhất. Giao hàng nhanh toàn quốc.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">✅ Hàng chính hãng</span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">🚚 Giao hàng toàn quốc</span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">💳 Thanh toán chuyển khoản</span>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar value={search} onChange={handleSearch} />
          <CategoryFilter categories={categories} selected={categoryId} onChange={handleCategory} />
        </div>

        {/* Results info */}
        {!isLoading && (
          <p className="text-sm text-gray-500 mb-4">
            {data?.total ?? 0} sản phẩm{search ? ` cho "${search}"` : ''}
          </p>
        )}

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            <button
              onClick={() => { setSearch(''); setCategoryId('all'); }}
              className="mt-4 text-blue-600 text-sm hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              ← Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              Sau →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
