import { BaseResponse } from "@/lib/interface/baseresponse";
import { Cart, CartItem } from "@/lib/interface/cart.interface";
import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";
import { TokenManager } from "@/lib/token-client";
import { tokenType } from "@/lib/token";

export class CartService {
  private static instance: CartService;

  private constructor() {}

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  private async getAuthHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Only manually add the token on the server side (SSR)
    // On the client, the browser will handle cookies automatically via the same-origin proxy.
    if (typeof window === "undefined") {
      const token = await TokenManager.getToken(tokenType.ACCESS);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async getCart(): Promise<BaseResponse<CartItem[]>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CARTS).build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store", // Ensure we get fresh cart data
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching cart:", error);
      return { success: false, message: "Failed to fetch cart" };
    }
  }

  async addToCart(productId: string): Promise<BaseResponse<Cart>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CARTS).addParam("add").build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ product: productId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, message: "Failed to add to cart" };
    }
  }

  async removeFromCart(productId: string): Promise<BaseResponse<Cart>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CARTS).addParam("remove").build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ product: productId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false, message: "Failed to remove from cart" };
    }
  }

  async decreaseQuantity(productId: string): Promise<BaseResponse<Cart>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.CARTS).addParam("decrease").build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ product: productId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      return { success: false, message: "Failed to decrease quantity" };
    }
  }

  async updateQuantity(productId: string, quantity: number): Promise<BaseResponse<Cart>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.CARTS)
        .addParam("modify")
        .build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ product: productId, quantity }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating quantity:", error);
      return { success: false, message: "Failed to update quantity" };
    }
  }
}
