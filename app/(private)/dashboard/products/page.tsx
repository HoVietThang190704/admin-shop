'use client';

import { useEffect, useState } from 'react';
import { ProductService } from '@/service/product.service';
import type { Product } from '@/lib/interface/product.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await ProductService.getInstance().getProducts();
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-600 mt-2">Tổng cộng: {products.length} sản phẩm</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      {/* Derived state for pagination */}
      {(() => {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const currentProducts = products.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

        return (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {products.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  Chưa có sản phẩm nào
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-6 font-semibold text-gray-900">
                            Sản phẩm
                          </th>
                          <th className="text-left py-3 px-6 font-semibold text-gray-900">
                            Danh mục
                          </th>
                          <th className="text-left py-3 px-6 font-semibold text-gray-900">
                            Giá
                          </th>
                          <th className="text-left py-3 px-6 font-semibold text-gray-900">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900">
                        ₫{product.price.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, products.length)} trong số {products.length} sản phẩm
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
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
