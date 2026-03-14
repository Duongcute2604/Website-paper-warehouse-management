import React, { useState } from 'react';
import { mockTransactions as initialTx, mockProducts, mockSuppliers, formatVND, formatDate } from '../../data/mockData';
import type { Transaction } from '../../types/admin';

type Tab = 'import' | 'export' | 'history';

interface TxForm {
  productId: string;
  quantity: string;
  unitPrice: string;
  supplierOrCustomer: string;
  date: string;
  notes: string;
}

const emptyForm: TxForm = { productId: '', quantity: '', unitPrice: '', supplierOrCustomer: '', date: new Date().toISOString().slice(0, 10), notes: '' };

export default function TransactionPage() {
  const [tab, setTab] = useState<Tab>('import');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTx);
  const [form, setForm] = useState<TxForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'import' | 'export'>('all');

  const selectedProduct = mockProducts.find((p) => p._id === form.productId);

  const handleSubmit = (type: 'import' | 'export') => {
    if (!form.productId || !form.quantity || +form.quantity <= 0) {
      setFormError('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
      return;
    }
    const product = mockProducts.find((p) => p._id === form.productId)!;
    const qty = +form.quantity;
    const price = +form.unitPrice || (type === 'import' ? product.costPrice : product.price);
    const tx: Transaction = {
      _id: 'tx' + Date.now(),
      type,
      product: form.productId,
      productName: product.name,
      quantity: qty,
      unit: product.unit,
      unitPrice: price,
      totalPrice: qty * price,
      ...(type === 'import'
        ? { supplier: form.supplierOrCustomer, supplierName: mockSuppliers.find((s) => s._id === form.supplierOrCustomer)?.name || form.supplierOrCustomer }
        : { customer: form.supplierOrCustomer }),
      date: form.date,
      notes: form.notes,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);
    setForm(emptyForm);
    setFormError('');
    alert(`Đã tạo phiếu ${type === 'import' ? 'nhập' : 'xuất'} kho thành công!`);
  };

  const historyFiltered = transactions.filter((t) => filterType === 'all' || t.type === filterType);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'import', label: 'Nhập kho' },
    { key: 'export', label: 'Xuất kho' },
    { key: 'history', label: 'Lịch sử' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Import Form */}
      {tab === 'import' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Phiếu nhập kho</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
              <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Chọn sản phẩm --</option>
                {mockProducts.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.unit})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                <input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ)</label>
                <input type="number" value={form.unitPrice} placeholder={selectedProduct ? String(selectedProduct.costPrice) : ''}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
              <select value={form.supplierOrCustomer} onChange={(e) => setForm({ ...form, supplierOrCustomer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Chọn nhà cung cấp --</option>
                {mockSuppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhập</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-3">
              <button onClick={() => handleSubmit('import')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Tạo phiếu nhập
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                🖨 In phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Form */}
      {tab === 'export' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Phiếu xuất kho</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
              <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Chọn sản phẩm --</option>
                {mockProducts.map((p) => <option key={p._id} value={p._id}>{p.name} (Tồn: {p.currentStock} {p.unit})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                <input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ)</label>
                <input type="number" value={form.unitPrice} placeholder={selectedProduct ? String(selectedProduct.price) : ''}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
              <input type="text" value={form.supplierOrCustomer} onChange={(e) => setForm({ ...form, supplierOrCustomer: e.target.value })}
                placeholder="Tên khách hàng..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày xuất</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-3">
              <button onClick={() => handleSubmit('export')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Tạo phiếu xuất
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                🖨 In phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div>
          <div className="flex gap-3 mb-4">
            {(['all', 'import', 'export'] as const).map((f) => (
              <button key={f} onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                {f === 'all' ? 'Tất cả' : f === 'import' ? 'Nhập kho' : 'Xuất kho'}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Sản phẩm</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Số lượng</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Đơn giá</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Thành tiền</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Đối tác</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">In phiếu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyFiltered.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.type === 'import' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                          {t.type === 'import' ? '↓ Nhập' : '↑ Xuất'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{t.productName}</td>
                      <td className="px-4 py-3 text-right">{t.quantity} {t.unit}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatVND(t.unitPrice)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatVND(t.totalPrice)}</td>
                      <td className="px-4 py-3 text-gray-600">{t.supplierName || t.customer || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(t.date)}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => window.print()} className="text-blue-600 hover:text-blue-800 text-xs font-medium">🖨 In</button>
                      </td>
                    </tr>
                  ))}
                  {historyFiltered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Không có giao dịch nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
