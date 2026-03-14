import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { mockApi } from '../../services/api';
import type { Order } from '../../types';

type ShippingZone = 'inner' | 'outer';

const SHIPPING_FEES: Record<ShippingZone, number> = {
  inner: 30000,
  outer: 50000,
};

const BANK_INFO = {
  bankName: 'Vietcombank',
  accountNumber: '1234567890',
  accountHolder: 'CONG TY KHO GIAY',
};

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
  shippingZone: ShippingZone;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    notes: '',
    shippingZone: 'inner',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  if (items.length === 0 && !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500 mb-4">Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <Link to="/" className="text-blue-600 hover:underline">← Quay lại trang chủ</Link>
      </div>
    );
  }

  const shippingFee = SHIPPING_FEES[form.shippingZone];
  const totalAmount = subtotal + shippingFee;

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[0-9]{9}$/.test(form.phone.trim())) errs.phone = 'Số điện thoại không hợp lệ';
    if (!form.address.trim()) errs.address = 'Vui lòng nhập địa chỉ giao hàng';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const created = await mockApi.createOrder({
        customer: { fullName: form.fullName, phone: form.phone, address: form.address },
        items: items.map((i) => ({
          product: i.product._id,
          productName: i.product.name,
          quantity: i.quantity,
          unit: i.product.unit,
          unitPrice: i.product.price,
          totalPrice: i.product.price * i.quantity,
        })),
        subtotal,
        shippingFee,
        totalAmount,
        paymentMethod: 'bank_transfer',
        notes: form.notes,
      });
      setOrder(created);
      clearCart();
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
          <p className="text-gray-500 mb-6">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất.</p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Mã đơn hàng của bạn:</p>
            <p className="text-xl font-bold text-blue-600">{order.orderCode}</p>
          </div>

          {/* Bank transfer info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin chuyển khoản</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngân hàng:</span>
                <span className="font-medium">{BANK_INFO.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tài khoản:</span>
                <span className="font-medium font-mono">{BANK_INFO.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chủ tài khoản:</span>
                <span className="font-medium">{BANK_INFO.accountHolder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nội dung CK:</span>
                <span className="font-medium text-blue-600">{order.orderCode}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-700 font-medium">Số tiền:</span>
                <span className="font-bold text-blue-600">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/order-tracking?code=${order.orderCode}&phone=${order.customer.phone}`)}
              className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors text-sm"
            >
              Theo dõi đơn hàng
            </button>
            <Link
              to="/"
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm text-center"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0901234567"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    rows={3}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực giao hàng</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([['inner', 'Nội thành', '30.000 đ'], ['outer', 'Ngoại thành', '50.000 đ']] as const).map(([val, label, fee]) => (
                      <label
                        key={val}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          form.shippingZone === val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingZone"
                          value={val}
                          checked={form.shippingZone === val}
                          onChange={() => setForm({ ...form, shippingZone: val })}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{label}</p>
                          <p className="text-xs text-gray-500">{fee}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bank info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Thông tin thanh toán</h2>
              <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-2">
                <p className="text-gray-600">Phương thức: <span className="font-medium text-gray-900">Chuyển khoản ngân hàng</span></p>
                <p className="text-gray-600">Ngân hàng: <span className="font-medium">{BANK_INFO.bankName}</span></p>
                <p className="text-gray-600">Số TK: <span className="font-mono font-medium">{BANK_INFO.accountNumber}</span></p>
                <p className="text-gray-600">Chủ TK: <span className="font-medium">{BANK_INFO.accountHolder}</span></p>
                <p className="text-xs text-gray-500 mt-2">Nội dung chuyển khoản: <strong>Mã đơn hàng</strong> (sẽ hiển thị sau khi đặt hàng)</p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Đơn hàng của bạn</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 flex-1 pr-2 truncate">
                      {product.name} × {quantity}
                    </span>
                    <span className="font-medium text-gray-900 flex-shrink-0">
                      {(product.price * quantity).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Tổng thanh toán</span>
                  <span className="text-blue-600">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
