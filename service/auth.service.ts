import { BaseResponse } from "@/lib/interface/baseresponse";
import { User } from "@/lib/interface/user.interface";
import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";

type LoginResponse = {
  token: string;
};

type ParsedResponse = string | Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseResponse = async (response: Response): Promise<ParsedResponse> => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(
    username: string,
    password: string,
  ): Promise<BaseResponse<LoginResponse>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.AUTH)
        .addParam("login")
        .addQueryParam("type", "admin")
        .build();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const payload = await parseResponse(response);

      if (response.ok) {
        const token =
          typeof payload === "string"
            ? payload
            : isRecord(payload) && isRecord(payload.data) && typeof payload.data.token === "string"
            ? payload.data.token
            : "";
        return {
          success: true,
          message: "",
          data: { token },
        };
      }

      return {
        success: false,
        message:
          (isRecord(payload) && typeof payload.message === "string"
            ? payload.message
            : typeof payload === "string"
            ? payload
            : "") || "Login failed",
      };
    } catch (error) {
      console.error("Error during login:", error);
      return {
        message: "Login failed",
        success: false,
      };
    }
  }

  async register (
    username: string,
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<BaseResponse<null>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.AUTH)
        .addParam("register")
        .build();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, name, email, password, confirmPassword }),
      });

      const payload = await parseResponse(response);

      return {
        success: response.ok,
        message:
          (isRecord(payload) && typeof payload.message === "string"
            ? payload.message
            : typeof payload === "string"
            ? payload
            : "") ||
          (response.ok ? "Registration successful" : "Registration failed"),
      };
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        message: "Registration failed",
        success: false,
      };
    }
  }

  async logout(): Promise<BaseResponse<null>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.AUTH)
        .addParam("logout")
        .build();
        
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return {
        success: response.ok,
        message: response.ok ? "Logout successful" : "Logout failed",
      };
    } catch (error) {
      console.error("Error during logout:", error);
      return {
        message: "Logout failed",
        success: false,
      };
    }
  }

  async getCurrentUser(token: string): Promise<BaseResponse<User | null>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.AUTH)
        .addParam("me")
        .build();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching current user:", error);
      return {
        message: "Failed to fetch current user",
        success: false,
      };

    }
  }
}
