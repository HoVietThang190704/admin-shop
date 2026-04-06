import { EndpointKey } from "./shared/constants/endpoint";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const baseUrl = typeof window === "undefined" ? serverUrl : "";

export class UrlBuilder {
  private url: string = baseUrl;

  addPath(path: EndpointKey): this {
    this.url += path;
    return this;
  }

  addParam(path: string): this {
    this.url += `/${path}`;
    return this;
  }

  addQueryParam(key: string, value: string | number): this {
    const separator = this.url.includes("?") ? "&" : "?";
    this.url += `${separator}${encodeURIComponent(key)}=${encodeURIComponent(
      value,
    )}`;
    return this;
  }

  build(): string {
    return this.url;
  }
}
