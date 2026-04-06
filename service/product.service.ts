import { BaseResponse } from "@/lib/interface/baseresponse";
import { Product } from "@/lib/interface/product.interface";
import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";

export class ProductService {
  private static instance: ProductService;
  private constructor() {}
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getProducts(): Promise<BaseResponse<Product[]>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.PRODUCTS);
      const response = await fetch(url.build(), {
        cache: 'no-store' // Always fetch fresh data on Admin Panel
      });
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return { 
        data: [], 
        message: "Failed to fetch products", 
        success: false 
      };
    }
  }

  async getProductById(id: string): Promise<BaseResponse<Product>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.PRODUCTS).addParam(id);
      const response = await fetch(url.build(), {
        cache: 'no-store'
      });
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return { 
        message: "Failed to fetch product", 
        success: false 
      };
    }
  }

  async getProductBySlug(slug: string): Promise<BaseResponse<Product>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.PRODUCTS).addParam("detail").addParam(slug);
      const response = await fetch(url.build(), {
        cache: 'no-store'
      });
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product by slug ${slug}:`, error);
      return { 
        message: "Failed to fetch product by slug", 
        success: false 
      };
    }
  }

  async createProduct(data: { 
    title: string; 
    price: number; 
    description: string; 
    images: string[]; 
    category: string; 
    stock?: number;
  }): Promise<BaseResponse<any>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.PRODUCTS);
      const response = await fetch(url.build(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
         return { 
           success: false, 
           message: result.message || `Lỗi từ máy chủ: ${response.status}`,
           data: null 
         };
      }
      
      return result;
    } catch (error) {
      console.error("Error creating product:", error);
      return { 
        message: "Failed to create product", 
        success: false 
      };
    }
  }
}
