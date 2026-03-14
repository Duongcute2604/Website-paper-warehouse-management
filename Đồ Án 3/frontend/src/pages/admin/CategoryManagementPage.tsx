import React, { useState } from 'react';
import { mockCategories as initialCategories } from '../../data/mockData';
import type { Category } from '../../types';

interface CatForm { name: string; description: string; isActive: boolean; }
const emptyForm: CatForm = { name: '', description: '', isActive: true };

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CatForm>(emptyForm);
  const [formError, setFormError] = useState('');

  const openAdd = () => { setEditId(null); setForm(emptyForm); setFormError(''); setShowModal(true); };
  const openEdit = (c: Category) => {
    setEditId(c._id);
    setForm({ name: c.name, description: c.description, isActive: c.isActive });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xác nhận xóa danh mục này?')) {
      setCategories((prev) => prev.filter((c) => c._id !== id));
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) { setFormError('Vui lòng nhập tên danh mục'); return; }
    if (editId) {
      setCategories((prev) => prev.map((c) => c._id === editId ? { ...c, name: form.name, description: form.description, isActive: form.isActive } : c));
    } else {
      const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setCategories((prev) => [...prev, { _id: 'cat' + Date.now(), name: form.name, description: form.description, slug, isActive: form.isActive }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tên danh mục</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Mô tả</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.description || '—'}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {c.isActive ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Sửa</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">{editId ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="catActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600" />
                <label htmlFor="catActive" className="text-sm text-gray-700">Đang hoạt động</label>
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
