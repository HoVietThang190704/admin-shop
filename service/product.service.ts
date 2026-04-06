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
        next: { revalidate: 60 } // Next.js ISR/Cache options if needed
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
      const response = await fetch(url.build());
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
        next: { revalidate: 3600 } 
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
}
