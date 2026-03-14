import React, { useState } from 'react';
import { mockProducts, mockOrders, mockExpenses, formatVND } from '../../data/mockData';
import type { Expense } from '../../types/admin';
import { EXPENSE_TYPE_LABELS } from '../../types/admin';

type Tab = 'inventory' | 'revenue' | 'expense' | 'profit';

export default function ReportsPage() {
  const [tab, setTab] = useState<Tab>('inventory');

  const handleExportExcel = (reportName: string) => {
    alert(`Xuất Excel báo cáo: ${reportName}\n(Chức năng demo)`);
  };

  // Inventory report data
  const inventoryData = mockProducts.map((p) => ({
    name: p.name,
    category: p.category.name,
    unit: p.unit,
    stock: p.currentStock,
    minStock: p.minStockLevel,
    costPrice: p.costPrice,
    totalValue: p.currentStock * p.costPrice,
    status: p.currentStock < p.minStockLevel ? 'Thấp' : 'Đủ',
  }));
  const totalInventoryValue = inventoryData.reduce((s, r) => s + r.totalValue, 0);

  // Revenue report data
  const completedOrders = mockOrders.filter((o) => o.status === 'completed');
  const revenueByCategory: Record<string, number> = {};
  completedOrders.forEach((o) => {
    o.items.forEach((item) => {
      const product = mockProducts.find((p) => p._id === item.product);
      const catName = product?.category.name || 'Khác';
      revenueByCategory[catName] = (revenueByCategory[catName] || 0) + item.totalPrice;
    });
  });
  const totalRevenue = completedOrders.reduce((s, o) => s + o.totalAmount, 0);

  // Expense report data
  const expenseByType: Record<Expense['type'], number> = { labor: 0, transport: 0, other: 0 };
  mockExpenses.forEach((e) => { expenseByType[e.type] += e.amount; });
  const totalExpense = mockExpenses.reduce((s, e) => s + e.amount, 0);

  // Profit report
  const totalCOGS = completedOrders.reduce((s, o) => {
    return s + o.items.reduce((is, item) => {
      const product = mockProducts.find((p) => p._id === item.product);
      return is + (product?.costPrice || 0) * item.quantity;
    }, 0);
  }, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const netProfit = grossProfit - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const tabs: { key: Tab; label: string }[] = [
    { key: 'inventory', label: 'Tồn kho' },
    { key: 'revenue', label: 'Doanh thu' },
    { key: 'expense', label: 'Chi phí' },
    { key: 'profit', label: 'Lợi nhuận' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Inventory Report */}
      {tab === 'inventory' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Tổng giá trị tồn kho: <span className="font-bold text-gray-900">{formatVND(totalInventoryValue)}</span>
            </div>
            <button onClick={() => handleExportExcel('Tồn kho')} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              📊 Xuất Excel
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Sản phẩm</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Danh mục</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Tồn kho</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Tối thiểu</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Giá vốn</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Giá trị</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventoryData.map((r, i) => (
                    <tr key={i} className={`hover:bg-gray-50 ${r.status === 'Thấp' ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                      <td className="px-4 py-3 text-gray-600">{r.category}</td>
                      <td className={`px-4 py-3 text-right font-medium ${r.status === 'Thấp' ? 'text-red-600' : 'text-gray-900'}`}>{r.stock} {r.unit}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{r.minStock}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatVND(r.costPrice)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(r.totalValue)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'Thấp' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {r.status === 'Thấp' ? '⚠ Thấp' : '✓ Đủ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 font-semibold text-gray-700">Tổng cộng</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatVND(totalInventoryValue)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {tab === 'revenue' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Tổng doanh thu (đơn hoàn thành): <span className="font-bold text-gray-900">{formatVND(totalRevenue)}</span>
            </div>
            <button onClick={() => handleExportExcel('Doanh thu')} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              📊 Xuất Excel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Số đơn hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Tổng doanh thu</p>
              <p className="text-xl font-bold text-green-600">{formatVND(totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Trung bình/đơn</p>
              <p className="text-xl font-bold text-gray-900">{completedOrders.length > 0 ? formatVND(totalRevenue / completedOrders.length) : '—'}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Doanh thu theo danh mục</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Danh mục</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Doanh thu</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(revenueByCategory).map(([cat, rev]) => (
                  <tr key={cat} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(rev)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expense Report */}
      {tab === 'expense' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Tổng chi phí: <span className="font-bold text-gray-900">{formatVND(totalExpense)}</span>
            </div>
            <button onClick={() => handleExportExcel('Chi phí')} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              📊 Xuất Excel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {(Object.keys(expenseByType) as Expense['type'][]).map((type) => (
              <div key={type} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">{EXPENSE_TYPE_LABELS[type]}</p>
                <p className="text-xl font-bold text-gray-900">{formatVND(expenseByType[type])}</p>
                <p className="text-xs text-gray-400 mt-1">{totalExpense > 0 ? ((expenseByType[type] / totalExpense) * 100).toFixed(1) : 0}%</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Số tiền</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(Object.keys(expenseByType) as Expense['type'][]).map((type) => (
                  <tr key={type} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{EXPENSE_TYPE_LABELS[type]}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(expenseByType[type])}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{totalExpense > 0 ? ((expenseByType[type] / totalExpense) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700">Tổng cộng</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatVND(totalExpense)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Profit Report */}
      {tab === 'profit' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => handleExportExcel('Lợi nhuận')} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              📊 Xuất Excel
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Doanh thu</p>
              <p className="text-lg font-bold text-green-600">{formatVND(totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Giá vốn hàng bán</p>
              <p className="text-lg font-bold text-orange-600">{formatVND(totalCOGS)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Chi phí hoạt động</p>
              <p className="text-lg font-bold text-red-600">{formatVND(totalExpense)}</p>
            </div>
            <div className={`rounded-xl border p-4 ${netProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-xs text-gray-500 mb-1">Lợi nhuận ròng</p>
              <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatVND(netProfit)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Bảng tổng hợp lợi nhuận</h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">Tổng doanh thu</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{formatVND(totalRevenue)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">(-) Giá vốn hàng bán (COGS)</td>
                  <td className="px-4 py-3 text-right font-medium text-orange-600">- {formatVND(totalCOGS)}</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">= Lợi nhuận gộp</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatVND(grossProfit)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">(-) Chi phí hoạt động</td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">- {formatVND(totalExpense)}</td>
                </tr>
                <tr className={`${netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <td className="px-4 py-3 font-bold text-gray-900">= Lợi nhuận ròng</td>
                  <td className={`px-4 py-3 text-right font-bold text-xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatVND(netProfit)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">Tỷ suất lợi nhuận</td>
                  <td className={`px-4 py-3 text-right font-bold ${+profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profitMargin}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
