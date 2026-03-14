import React, { useState } from 'react';
import { mockOrders as initialOrders, formatVND, formatDate } from '../../data/mockData';
import type { Order } from '../../types';

type StatusFilter = 'all' | Order['status'];

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

const STATUS_OPTIONS: Order['status'][] = ['pending', 'approved', 'shipping', 'completed', 'cancelled'];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => filter === 'all' || o.status === filter);

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? {
              ...o,
              status: newStatus,
              statusHistory: [
                ...o.statusHistory,
                { status: newStatus, changedAt: new Date().toISOString(), note: STATUS_LABELS[newStatus] },
              ],
            }
          : o
      )
    );
    if (selectedOrder?._id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              statusHistory: [
                ...prev.statusHistory,
                { status: newStatus, changedAt: new Date().toISOString(), note: STATUS_LABELS[newStatus] },
              ],
            }
          : null
      );
    }
  };

  const handleExportVAT = (order: Order) => {
    alert(`Xuất hóa đơn VAT cho đơn hàng ${order.orderCode}\nTổng tiền: ${formatVND(order.totalAmount)}`);
  };

  const filterButtons: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    ...STATUS_OPTIONS.map((s) => ({ key: s as StatusFilter, label: STATUS_LABELS[s] })),
  ];

  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filterButtons.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f.key ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 text-xs opacity-75">
                ({orders.filter((o) => o.status === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mã đơn</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Khách hàng</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Tổng tiền</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày đặt</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Cập nhật</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{o.orderCode}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{o.customer.fullName}</div>
                    <div className="text-xs text-gray-500">{o.customer.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(o.totalAmount)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value as Order['status'])}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setSelectedOrder(o)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Chi tiết</button>
                      <button onClick={() => handleExportVAT(o)} className="text-green-600 hover:text-green-800 text-xs font-medium">VAT</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Không có đơn hàng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Chi tiết đơn hàng</h2>
                <p className="text-sm text-gray-500 font-mono">{selectedOrder.orderCode}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-5">
              {/* Customer */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Thông tin khách hàng</h3>
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <p><span className="text-gray-500">Họ tên:</span> <span className="font-medium">{selectedOrder.customer.fullName}</span></p>
                  <p><span className="text-gray-500">SĐT:</span> {selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.email && <p><span className="text-gray-500">Email:</span> {selectedOrder.customer.email}</p>}
                  <p><span className="text-gray-500">Địa chỉ:</span> {selectedOrder.customer.address}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">Sản phẩm</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600">SL</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600">Đơn giá</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{item.productName}</td>
                        <td className="px-3 py-2 text-right">{item.quantity} {item.unit}</td>
                        <td className="px-3 py-2 text-right">{formatVND(item.unitPrice)}</td>
                        <td className="px-3 py-2 text-right font-medium">{formatVND(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2 text-sm space-y-1 text-right">
                  <p className="text-gray-600">Tạm tính: {formatVND(selectedOrder.subtotal)}</p>
                  <p className="text-gray-600">Phí ship: {formatVND(selectedOrder.shippingFee)}</p>
                  <p className="font-semibold text-gray-900">Tổng: {formatVND(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              {/* Status history */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Lịch sử trạng thái</h3>
                <div className="space-y-2">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[h.status as Order['status']] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[h.status as Order['status']] || h.status}
                      </span>
                      <span className="text-gray-500 text-xs">{new Date(h.changedAt).toLocaleString('vi-VN')}</span>
                      {h.note && <span className="text-gray-600">{h.note}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Update status */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Cập nhật trạng thái:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value as Order['status'])}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <button onClick={() => handleExportVAT(selectedOrder)} className="ml-auto px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                  Xuất hóa đơn VAT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
