import React from 'react';
import { Link } from 'react-router-dom';
import { mockProducts, mockOrders, mockExpenses, formatVND, formatDate } from '../../data/mockData';
import type { Order } from '../../types';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  shipping: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const today = new Date().toDateString();
  const todayOrders = mockOrders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const monthRevenue = mockOrders
    .filter((o) => o.status === 'completed' && new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, o) => s + o.totalAmount, 0);
  const totalStock = mockProducts.reduce((s, p) => s + p.currentStock, 0);
  const lowStockProducts = mockProducts.filter((p) => p.currentStock < p.minStockLevel);
  const recentOrders = [...mockOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const stats = [
    { label: 'Tổng sản phẩm', value: mockProducts.length, icon: '📦', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-600' },
    { label: 'Tổng tồn kho', value: totalStock, icon: '🏭', color: 'bg-green-50 border-green-200', textColor: 'text-green-600' },
    { label: 'Đơn hàng hôm nay', value: todayOrders.length, icon: '🛒', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-600' },
    { label: 'Doanh thu tháng', value: formatVND(monthRevenue), icon: '💰', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-600', isText: true },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`font-bold ${s.isText ? 'text-base' : 'text-2xl'} ${s.textColor}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Đơn hàng mới nhất</h2>
            <Link to="/admin/orders" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Xem tất cả →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 text-xs">Mã đơn</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 text-xs">Khách hàng</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-600 text-xs">Tổng tiền</th>
                  <th className="text-center px-4 py-2.5 font-medium text-gray-600 text-xs">Trạng thái</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 text-xs">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{o.orderCode}</td>
                    <td className="px-4 py-2.5 text-gray-900">{o.customer.fullName}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900">{formatVND(o.totalAmount)}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                        {STATUS_LABELS[o.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock warning */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">⚠ Sắp hết hàng</h2>
            <Link to="/admin/inventory" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Xem kho →</Link>
          </div>
          <div className="p-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Tất cả sản phẩm đủ hàng ✓</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{p.currentStock}</p>
                    <p className="text-xs text-gray-400">min: {p.minStockLevel}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{mockOrders.filter((o) => o.status === 'pending').length}</p>
          <p className="text-xs text-gray-500 mt-1">Chờ duyệt</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{mockOrders.filter((o) => o.status === 'shipping').length}</p>
          <p className="text-xs text-gray-500 mt-1">Đang giao</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{mockOrders.filter((o) => o.status === 'completed').length}</p>
          <p className="text-xs text-gray-500 mt-1">Hoàn thành</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-gray-900">{formatVND(mockExpenses.reduce((s, e) => s + e.amount, 0))}</p>
          <p className="text-xs text-gray-500 mt-1">Tổng chi phí</p>
        </div>
      </div>
    </div>
  );
}
