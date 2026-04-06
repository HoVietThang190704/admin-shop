'use client';

import { useEffect, useState } from 'react';
import { OrderService } from '@/service/order.service';
import type { Order } from '@/lib/interface/order.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await OrderService.getInstance().getOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['orderStatus']) => {
    const colors: Record<Order['orderStatus'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    const colors: Record<Order['paymentStatus'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        <p className="text-gray-600 mt-2">Tổng cộng: {orders.length} đơn hàng</p>
      </div>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {(() => {
            const totalPages = Math.ceil(orders.length / itemsPerPage);
            const currentOrders = orders.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            );

            return (
              <div className="flex flex-col">
                {orders.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    Chưa có đơn hàng nào
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-6 font-semibold text-gray-900">
                              Mã đơn
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-900">
                              Khách hàng
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-900">
                              Tổng tiền
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-900">
                              Trạng thái
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-900">
                              Thanh toán
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-900">
                              Hành động
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-6 font-medium text-gray-900">
                                {order.orderNumber}
                              </td>
                              <td className="py-4 px-6">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {order.user.username}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {order.user.email}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-medium text-gray-900">
                                ₫{order.totalAmount.toLocaleString('vi-VN')}
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                                >
                                  {order.orderStatus}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                                >
                                  {order.paymentStatus}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer */}
                    {orders.length > 0 && (
                      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, orders.length)} trong số {orders.length} đơn hàng
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-gray-600 px-3 font-medium">
                            Trang {currentPage} / {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}
        </CardContent>

      </Card>
    </div>
  );
}
