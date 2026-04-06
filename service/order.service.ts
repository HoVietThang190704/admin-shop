import { BaseResponse } from "@/lib/interface/baseresponse";
import { Order } from "@/lib/interface/order.interface";
import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";

export class OrderService {
  private static instance: OrderService;
  
  private constructor() {}
  
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getOrders(): Promise<BaseResponse<Order[]>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.ORDERS);
      const response = await fetch(url.build(), {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        data: [],
        message: "Failed to fetch orders",
        success: false,
      };
    }
  }

  async getOrderById(id: string): Promise<BaseResponse<Order>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.ORDERS).addParam(id);
      const response = await fetch(url.build(), {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return {
        message: "Failed to fetch order",
        success: false,
      };
    }
  }

  async updateOrderStatus(
    id: string,
    status: Order['orderStatus']
  ): Promise<BaseResponse<Order>> {
    try {
      const url = new UrlBuilder().addPath(Endpoint.ORDERS).addParam(id).addParam('status');
      const response = await fetch(url.build(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderStatus: status }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      return {
        message: "Failed to update order",
        success: false,
      };
    }
  }
}
