'use client';

import { useEffect, useState } from 'react';
import { CategoryService } from '@/service/category.service';
import type { Category } from '@/lib/interface/category.interface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDelete = async (categoryId: string) => {
    const isConfirmed = window.confirm('Bạn có chắc muốn xóa danh mục này không?');
    if (!isConfirmed) {
      return;
    }

    const res = await CategoryService.getInstance().deleteCategory(categoryId);
    if (res.success) {
      toast.success(res.message || 'Xóa danh mục thành công');
      setCategories((prev) => {
        const nextCategories = prev.filter((category) => category._id !== categoryId);
        const totalPages = Math.max(1, Math.ceil(nextCategories.length / itemsPerPage));
        setCurrentPage((page) => Math.min(page, totalPages));
        return nextCategories;
      });
    } else {
      toast.error(res.message || 'Xóa danh mục thất bại');
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await CategoryService.getInstance().getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
          <h1 className="text-4xl font-bold text-gray-900">Quản lý Danh mục</h1>
          <p className="text-gray-600 mt-2">
            Tổng cộng: {categories.length} danh mục
          </p>
        </div>
        <Link href="/dashboard/categories/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm danh mục
          </Button>
        </Link>
      </div>

      {/* Derived state for pagination */}
      {(() => {
        const totalPages = Math.ceil(categories.length / itemsPerPage);
        const currentCategories = categories.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

        return (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {categories.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  Chưa có danh mục nào
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-6 font-semibold text-gray-900 w-24">
                            Hình ảnh
                          </th>
                          <th className="text-left py-3 px-6 font-semibold text-gray-900">
                            Danh mục
                          </th>
                          <th className="text-left py-3 px-6 font-semibold text-gray-900">
                            Slug
                          </th>
                          <th className="text-left py-3 px-6 font-semibold text-gray-900">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentCategories.map((category) => (
                          <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                  No img
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <p className="font-medium text-gray-900">
                                {category.name}
                              </p>
                            </td>
                            <td className="py-4 px-6 text-gray-600 text-sm">
                              {category.slug}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Link href={`/dashboard/categories/${category._id}/edit`}>
                                  <Button variant="outline" size="icon" className="h-9 w-9">
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDelete(category._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  {categories.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, categories.length)} trong số {categories.length} danh mục
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
