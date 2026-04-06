"use server";

import { TokenManager } from "@/lib/token-server";
import { tokenType } from "@/lib/token";
import { redirect } from "next/navigation";

export async function logout() {
  await TokenManager.removeToken(tokenType.ACCESS);
  redirect("/");
}