export const tokenType = {
  ACCESS: "accessToken",
  REFRESH: "refresh",
} as const;

export type TokenType = (typeof tokenType)[keyof typeof tokenType];