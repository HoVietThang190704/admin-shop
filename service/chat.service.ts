import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";

interface MessageContent {
  type: string;
  text: string;
}

export interface Message {
  _id?: string;
  from: string;
  to: string;
  messageContent: MessageContent;
  createdAt?: string;
}

export class ChatService {
  private static instance: ChatService;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Fetch users that have chatted with a specific user (or the current admin)
  // Our backend /api/v1/messages GET / returns list of users the logged-in user conversed with,
  // mapping them to { user: userId, message: lastMessage }
  async getConversations(): Promise<{ user: string, message: Message }[]> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.MESSAGES)
        .build();

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
  }

  // Fetch message history with a specific user
  async getMessages(userId: string): Promise<Message[]> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.MESSAGES)
        .addParam(userId)
        .build();

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  // Send a new message
  async sendMessage(to: string, text: string): Promise<Message | null> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.MESSAGES)
        .build();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ to, text }),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  // Fetch user info for display
  async getUser(id: string): Promise<any> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.USERS)
        .addParam(id)
        .build();
      const response = await fetch(url, {
        method: "GET",
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data[0] : data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user detail:", error);
      return null;
    }
  }
}
