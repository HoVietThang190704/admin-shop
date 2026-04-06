'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ProductService } from '@/service/product.service';
import { CategoryService } from '@/service/category.service';
import type { Category } from '@/lib/interface/category.interface';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await CategoryService.getInstance().getCategories();
        const catsData = res.data;
        if (res.success && catsData) {
          setCategories(catsData);
          if (catsData.length > 0) {
            setFormData(prev => ({ ...prev, category: catsData[0]._id }));
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        category: formData.category,
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };

      const res = await ProductService.getInstance().createProduct(payload);
      if (res.success) {
        toast.success(res.message || 'Thêm sản phẩm thành công');
        router.push('/dashboard/products');
      } else {
        toast.error(res.message || 'Thêm sản phẩm thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
          <p className="text-gray-600 mt-1">Điền thông tin chi tiết sản phẩm phía dưới</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
                <Input
                  required
                  placeholder="Ví dụ: Áo thun nam"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá bán (₫) *</label>
                  <Input
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng *</label>
                  <Input
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục *</label>
                  {loadingCats ? (
                    <div className="h-10 flex items-center text-sm text-gray-500">Đang tải danh mục...</div>
                  ) : (
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link Ảnh (URL)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="url"
                    className="pl-10"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Nhập mô tả sản phẩm..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/products">
                <Button variant="outline" type="button">Hủy</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
