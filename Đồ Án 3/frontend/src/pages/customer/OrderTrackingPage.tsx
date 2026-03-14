import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockApi } from '../../services/api';
import type { Order } from '../../types';

const STATUS_STEPS = [
  { key: 'pending', label: 'Chờ duyệt', icon: '📋' },
  { key: 'approved', label: 'Đã duyệt', icon: '✅' },
  { key: 'shipping', label: 'Đang giao', icon: '🚚' },
  { key: 'completed', label: 'Hoàn thành', icon: '🎉' },
];

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  shipping: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const [orderCode, setOrderCode] = useState(searchParams.get('code') ?? '');
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  // Auto-search if params provided
  useEffect(() => {
    if (searchParams.get('code') && searchParams.get('phone')) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!orderCode.trim() || !phone.trim()) {
      setError('Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại');
      return;
    }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const result = await mockApi.trackOrder(orderCode.trim(), phone.trim());
      setOrder(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Tra cứu đơn hàng</h1>
      <p className="text-gray-500 text-sm mb-8">Nhập mã đơn hàng và số điện thoại để xem trạng thái đơn hàng.</p>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng</label>
            <input
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="VD: ORD-20240115-001"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0901234567"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Đang tìm...' : 'Tra cứu'}
        </button>

        {/* Demo hint */}
        <p className="text-xs text-gray-400 mt-3">
          Demo: Mã <strong>ORD-20240115-001</strong> / SĐT <strong>0901234567</strong>
        </p>
      </form>

      {/* Order result */}
      {order && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Mã đơn hàng</p>
                <p className="text-xl font-bold text-gray-900">{order.orderCode}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Ngày đặt</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Khách hàng</p>
                <p className="font-medium">{order.customer.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500">Số điện thoại</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-5">Trạng thái đơn hàng</h3>
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-blue-500 z-0 transition-all"
                  style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }}
                />
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-colors ${
                        done ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'
                      }`}>
                        {done ? <span className="text-white text-sm">✓</span> : <span>{step.icon}</span>}
                      </div>
                      <p className={`text-xs mt-2 text-center font-medium ${done ? 'text-blue-600' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm đặt hàng</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-gray-500">{item.quantity} {item.unit} × {item.unitPrice.toLocaleString('vi-VN')} đ</p>
                  </div>
                  <p className="font-semibold text-gray-900">{item.totalPrice.toLocaleString('vi-VN')} đ</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{order.subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{order.shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                <span>Tổng thanh toán</span>
                <span className="text-blue-600">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin giao hàng</h3>
            <p className="text-sm text-gray-600">{order.customer.address}</p>
            {order.notes && (
              <p className="text-sm text-gray-500 mt-2">Ghi chú: {order.notes}</p>
            )}
          </div>

          {/* Status history */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Lịch sử trạng thái</h3>
            <div className="space-y-3">
              {[...order.statusHistory].reverse().map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    {i < order.statusHistory.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="font-medium text-gray-900">{STATUS_LABELS[h.status] ?? h.status}</p>
                    <p className="text-gray-500 text-xs">{formatDate(h.changedAt)}</p>
                    {h.note && <p className="text-gray-500 text-xs">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
