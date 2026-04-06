import { cookies } from "next/headers";
import { TokenType } from "./token";

async function getToken(tokenType: TokenType): Promise<string | null> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(tokenType)?.value;

  if (!token) {
    return null;
  }

  return token;
}

async function setToken(tokenType: TokenType, token: string): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.set(tokenType, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/", // Crucial: make sure it's accessible everywhere
  });
}

async function removeToken(tokenType: TokenType): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.delete(tokenType);
}

export const TokenManager = {
  getToken,
  setToken,
  removeToken,
};
