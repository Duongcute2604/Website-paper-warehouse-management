import React, { useState } from 'react';
import { mockProducts as initialProducts, mockCategories, formatVND } from '../../data/mockData';
import type { Product, Category } from '../../types';

interface ProductForm {
  name: string;
  description: string;
  categoryId: string;
  unit: string;
  price: string;
  costPrice: string;
  minStockLevel: string;
  isActive: boolean;
}

const emptyForm: ProductForm = {
  name: '', description: '', categoryId: '', unit: '', price: '', costPrice: '', minStockLevel: '10', isActive: true,
};

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formError, setFormError] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      categoryId: p.category._id,
      unit: p.unit,
      price: String(p.price),
      costPrice: String(p.costPrice),
      minStockLevel: String(p.minStockLevel),
      isActive: p.isActive,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xác nhận xóa sản phẩm này?')) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.categoryId || !form.unit.trim() || !form.price || !form.costPrice) {
      setFormError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    const cat = mockCategories.find((c) => c._id === form.categoryId) as Category;
    if (editId) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editId
            ? { ...p, name: form.name, description: form.description, category: cat, unit: form.unit, price: +form.price, costPrice: +form.costPrice, minStockLevel: +form.minStockLevel, isActive: form.isActive }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        _id: 'p' + Date.now(), name: form.name, description: form.description,
        category: cat, unit: form.unit, price: +form.price, costPrice: +form.costPrice,
        weight: 1, images: [], currentStock: 0, minStockLevel: +form.minStockLevel, isActive: form.isActive,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tên sản phẩm</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Danh mục</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Giá bán</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Tồn kho</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const lowStock = p.currentStock < p.minStockLevel;
                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.unit}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category.name}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(p.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {p.currentStock}
                      </span>
                      {lowStock && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          Thấp
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.isActive ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Sửa</button>
                        <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Không có sản phẩm nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Chọn --</option>
                    {mockCategories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị *</label>
                  <input type="text" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="ream, kg, cái..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá vốn (VNĐ) *</label>
                  <input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho tối thiểu</label>
                <input type="number" value={form.minStockLevel} onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600" />
                <label htmlFor="isActive" className="text-sm text-gray-700">Đang hoạt động</label>
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
