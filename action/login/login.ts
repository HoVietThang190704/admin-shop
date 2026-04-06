"use server";

import { AuthService } from "@/service/auth.service";
import { TokenManager } from "@/lib/token-server";
import { tokenType } from "@/lib/token";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const response = await AuthService.getInstance().login(username, password);

  if (response.success && response.data?.token) {
    await TokenManager.setToken(tokenType.ACCESS, response.data.token);
    return { success: true, message: "Đăng nhập thành công" };
  }

  return { 
    success: false, 
    message: response.message || "Đăng nhập thất bại" 
  };
}