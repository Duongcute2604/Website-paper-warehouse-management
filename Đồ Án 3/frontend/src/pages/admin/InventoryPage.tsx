import React, { useState } from 'react';
import { mockProducts, formatVND } from '../../data/mockData';
import type { Product } from '../../types';

type SortKey = 'name' | 'currentStock' | 'minStockLevel';
type SortDir = 'asc' | 'desc';

export default function InventoryPage() {
  const [sortKey, setSortKey] = useState<SortKey>('currentStock');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...mockProducts].sort((a, b) => {
    let va: string | number = a[sortKey];
    let vb: string | number = b[sortKey];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const lowStockCount = mockProducts.filter((p) => p.currentStock < p.minStockLevel).length;

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 text-gray-400">
      {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Tổng sản phẩm</p>
          <p className="text-2xl font-bold text-gray-900">{mockProducts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Tổng tồn kho</p>
          <p className="text-2xl font-bold text-gray-900">{mockProducts.reduce((s, p) => s + p.currentStock, 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Giá trị tồn kho</p>
          <p className="text-lg font-bold text-gray-900">{formatVND(mockProducts.reduce((s, p) => s + p.currentStock * p.costPrice, 0))}</p>
        </div>
        <div className={`rounded-xl border p-4 ${lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <p className="text-xs text-gray-500 mb-1">Sắp hết hàng</p>
          <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{lowStockCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  Sản phẩm <SortIcon k="name" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Đơn vị</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer select-none" onClick={() => handleSort('currentStock')}>
                  Tồn kho <SortIcon k="currentStock" />
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer select-none" onClick={() => handleSort('minStockLevel')}>
                  Tối thiểu <SortIcon k="minStockLevel" />
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Giá vốn</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Giá trị tồn</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((p: Product) => {
                const low = p.currentStock < p.minStockLevel;
                return (
                  <tr key={p._id} className={`hover:bg-gray-50 ${low ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.category.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.unit}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${low ? 'text-red-600' : 'text-gray-900'}`}>
                      {p.currentStock}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{p.minStockLevel}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatVND(p.costPrice)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(p.currentStock * p.costPrice)}</td>
                    <td className="px-4 py-3 text-center">
                      {low ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          ⚠ Thấp
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Đủ hàng
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
