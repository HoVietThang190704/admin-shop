import { AuthService } from "@/service/auth.service";
import { TokenManager } from "@/lib/token-server";
import { tokenType } from "@/lib/token";
import { redirect } from "next/navigation";
import { User } from "./interface/user.interface";

export async function getSession(): Promise<User | null> {
  try {
    const token = await TokenManager.getToken(tokenType.ACCESS);
    if (!token) {
      console.log("[Session] No token found");
      return null;
    }

    const response = await AuthService.getInstance().getCurrentUser(token);
    
    if (response.success && response.data) {
      console.log("[Session] User found:", response.data.fullName || response.data.username);
      return response.data;
    }

    console.log("[Session] Failed to fetch user or no session:", response.message);
    return null;
  } catch (error) {
    console.error("[Session] Error getting session:", error);
    return null;
  }
}