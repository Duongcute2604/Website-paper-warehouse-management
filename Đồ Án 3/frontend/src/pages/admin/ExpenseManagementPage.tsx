import React, { useState } from 'react';
import { mockExpenses as initialExpenses, formatVND, formatDate } from '../../data/mockData';
import type { Expense } from '../../types/admin';
import { EXPENSE_TYPE_LABELS } from '../../types/admin';

interface ExpenseForm { type: Expense['type']; amount: string; date: string; description: string; }
const emptyForm: ExpenseForm = { type: 'labor', amount: '', date: new Date().toISOString().slice(0, 10), description: '' };

type TypeFilter = 'all' | Expense['type'];

export default function ExpenseManagementPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ExpenseForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const filtered = expenses.filter((e) => typeFilter === 'all' || e.type === typeFilter);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setFormError(''); setShowModal(true); };
  const openEdit = (e: Expense) => {
    setEditId(e._id);
    setForm({ type: e.type, amount: String(e.amount), date: e.date, description: e.description });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xác nhận xóa chi phí này?')) {
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    }
  };

  const handleSave = () => {
    if (!form.amount || +form.amount <= 0) { setFormError('Số tiền phải lớn hơn 0'); return; }
    if (!form.description.trim()) { setFormError('Vui lòng nhập mô tả'); return; }
    if (editId) {
      setExpenses((prev) => prev.map((e) => e._id === editId ? { ...e, type: form.type, amount: +form.amount, date: form.date, description: form.description } : e));
    } else {
      setExpenses((prev) => [{ _id: 'e' + Date.now(), type: form.type, amount: +form.amount, date: form.date, description: form.description, createdAt: new Date().toISOString() }, ...prev]);
    }
    setShowModal(false);
  };

  const typeFilters: { key: TypeFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'labor', label: EXPENSE_TYPE_LABELS.labor },
    { key: 'transport', label: EXPENSE_TYPE_LABELS.transport },
    { key: 'other', label: EXPENSE_TYPE_LABELS.other },
  ];

  const TYPE_COLORS: Record<Expense['type'], string> = {
    labor: 'bg-blue-100 text-blue-700',
    transport: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700',
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((f) => (
            <button key={f.key} onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${typeFilter === f.key ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
          + Thêm chi phí
        </button>
      </div>

      {/* Total */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-blue-700">
          Tổng chi phí {typeFilter !== 'all' ? `(${EXPENSE_TYPE_LABELS[typeFilter as Expense['type']]})` : ''}
        </span>
        <span className="text-xl font-bold text-blue-700">{formatVND(totalFiltered)}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Loại chi phí</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Số tiền</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mô tả</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[e.type]}`}>
                      {EXPENSE_TYPE_LABELS[e.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(e.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-gray-600">{e.description}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(e)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Sửa</button>
                      <button onClick={() => handleDelete(e._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Không có chi phí nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">{editId ? 'Sửa chi phí' : 'Thêm chi phí'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại chi phí</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Expense['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {(Object.keys(EXPENSE_TYPE_LABELS) as Expense['type'][]).map((k) => (
                    <option key={k} value={k}>{EXPENSE_TYPE_LABELS[k]}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ) *</label>
                  <input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
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
