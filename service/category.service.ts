import { BaseResponse } from "@/lib/interface/baseresponse";
import { Category } from "@/lib/interface/category.interface";
import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";

export class CategoryService {
  private static instance: CategoryService;
  private constructor() {}
  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }
  async getCategories(): Promise<BaseResponse<Category[]>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CATEGORIES);
      return await fetch(url.build()).then((res) => res.json());
    } catch (error) {
      console.error(error);
      return { data: [], message: "Failed to fetch categories", success: false };
    }
  }

  async getCategoryById(id: string): Promise<BaseResponse<Category>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CATEGORIES).addParam(id);
      const response = await fetch(url.build(), {
        cache: 'no-store',
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch category',
        };
      }

      return {
        success: true,
        message: result.message || 'Get category successfully',
        data: result.data || result,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to fetch category' };
    }
  }

  async createCategory(data: { name: string; image?: string }): Promise<BaseResponse<Category>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CATEGORIES);
      const response = await fetch(url.build(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `Lỗi từ máy chủ: ${response.status}`,
        };
      }

      return {
        success: true,
        message: result.message || 'Thêm danh mục thành công',
        data: result.data || result,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to create category' };
    }
  }

  async updateCategory(id: string, data: { name?: string; image?: string }): Promise<BaseResponse<Category>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CATEGORIES).addParam(id);
      const response = await fetch(url.build(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `Lỗi từ máy chủ: ${response.status}`,
        };
      }

      return {
        success: true,
        message: result.message || 'Cập nhật danh mục thành công',
        data: result.data || result,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update category' };
    }
  }

  async deleteCategory(id: string): Promise<BaseResponse<Category>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CATEGORIES).addParam(id);
      const response = await fetch(url.build(), {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `Lỗi từ máy chủ: ${response.status}`,
        };
      }

      return {
        success: true,
        message: result.message || 'Xóa danh mục thành công',
        data: result.data || result,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete category' };
    }
  }
}
