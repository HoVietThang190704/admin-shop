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
}
