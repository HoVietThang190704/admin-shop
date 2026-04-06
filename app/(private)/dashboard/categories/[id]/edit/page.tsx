'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryService } from '@/service/category.service';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
  });

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId) {
        setError('Không tìm thấy danh mục');
        setLoading(false);
        return;
      }

      try {
        const res = await CategoryService.getInstance().getCategoryById(categoryId);
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || '',
            imageUrl: res.data.image || '',
          });
        } else {
          setError(res.message || 'Không tải được danh mục');
        }
      } catch {
        setError('Không tải được danh mục');
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error('Không tìm thấy danh mục');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await CategoryService.getInstance().updateCategory(categoryId, {
        name: formData.name.trim(),
        ...(formData.imageUrl.trim() ? { image: formData.imageUrl.trim() } : {}),
      });

      if (res.success) {
        toast.success(res.message || 'Cập nhật danh mục thành công');
        router.push('/dashboard/categories');
      } else {
        toast.error(res.message || 'Cập nhật danh mục thất bại');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/categories">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sửa danh mục</h1>
            <p className="text-gray-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sửa danh mục</h1>
          <p className="text-gray-600 mt-1">Cập nhật thông tin danh mục</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tên danh mục *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link ảnh (URL)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="url"
                  className="pl-10"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/categories">
                <Button variant="outline" type="button">Hủy</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}