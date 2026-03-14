import React, { useState } from 'react';
import { mockSuppliers as initialSuppliers, formatDate } from '../../data/mockData';
import type { Supplier } from '../../types/admin';

interface SupplierForm { name: string; phone: string; email: string; address: string; notes: string; }
const emptyForm: SupplierForm = { name: '', phone: '', email: '', address: '', notes: '' };

export default function SupplierManagementPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SupplierForm>(emptyForm);
  const [formError, setFormError] = useState('');

  const openAdd = () => { setEditId(null); setForm(emptyForm); setFormError(''); setShowModal(true); };
  const openEdit = (s: Supplier) => {
    setEditId(s._id);
    setForm({ name: s.name, phone: s.phone, email: s.email, address: s.address, notes: s.notes });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xác nhận xóa nhà cung cấp này?')) {
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
    }
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setFormError('Vui lòng nhập tên và số điện thoại');
      return;
    }
    if (editId) {
      setSuppliers((prev) => prev.map((s) => s._id === editId ? { ...s, ...form } : s));
    } else {
      setSuppliers((prev) => [...prev, { _id: 's' + Date.now(), ...form, createdAt: new Date().toISOString() }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Thêm nhà cung cấp
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tên nhà cung cấp</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Số điện thoại</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Địa chỉ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày thêm</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{s.address}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Sửa</button>
                      <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Chưa có nhà cung cấp nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">{editId ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà cung cấp *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
