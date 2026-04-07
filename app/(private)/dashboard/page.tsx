'use client';

import { useEffect, useState } from 'react';
import { ProductService } from '@/service/product.service';
import { CategoryService } from '@/service/category.service';
import { OrderService } from '@/service/order.service';
import type { Product } from '@/lib/interface/product.interface';
import type { Category } from '@/lib/interface/category.interface';
import type { Order } from '@/lib/interface/order.interface';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, ShoppingCart, Folder, Loader2 } from 'lucide-react';

type StatCard = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
};

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          ProductService.getInstance().getProducts(),
          CategoryService.getInstance().getCategories(),
          OrderService.getInstance().getOrders(),
        ]);

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data);
        }
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Tổng Sản Phẩm',
      value: products.length,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Tổng Danh Mục',
      value: categories.length,
      icon: <Folder className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Tổng Đơn Hàng',
      value: orders.length,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Doanh Thu',
      value: `₫${orders
        .filter(
          (order) =>
            order.orderStatus === 'confirmed' &&
            order.paymentStatus === 'paid'
        )
        .reduce((sum, order) => sum + order.totalAmount, 0)
        .toLocaleString('vi-VN')}`,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Chào mừng quay lại trang quản lý</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-600">Chưa có đơn hàng nào</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Mã đơn
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Khách hàng
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Tổng tiền
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {order.user.username}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        ₫{order.totalAmount.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
