"use client";

import { useEffect, useState, useRef, use } from "react";
import { ChatService, Message } from "@/service/chat.service";
import { useAuth } from "@/provider/AuthProvider";
import { io, Socket } from "socket.io-client";
import { Search, Send, User as UserIcon, MessageSquare } from "lucide-react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface Conversation {
  user: string;
  message: Message;
  userDetails?: any;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations initial load & setup socket
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });
    setSocket(newSocket);

    const fetchConversations = async () => {
      const chatSvc = ChatService.getInstance();
      const convs = await chatSvc.getConversations();
      
      const augmented = await Promise.all(convs.map(async (c) => {
         const details = await chatSvc.getUser(c.user);
         return { ...c, userDetails: details };
      }));
      setConversations(augmented);
    };
    fetchConversations();

    newSocket.on("receive_message", (msg: Message) => {
      setMessages((prev) => {
        // Using function scope so we can check if it relates to active chat
        // We'll trust useEffect dependency updates, but for accurate activeUserId, we might need a ref if closures are stale.
        // Actually since activeUserId is a dependency of another useEffect, this socket event closure only captures the initial activeUserId.
        // We should fix this. Local activeUserId inside receive_message closure is stale!
        
        return prev;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Handle activeUserid changes with socket inside another effect to use fresh state, or better:
  useEffect(() => {
    if (!socket) return;
    
    const handler = (msg: Message) => {
      // If the message belongs to active chat, push it
      setMessages((prev) => {
        const isRelated = msg.from === activeUserId || msg.to === activeUserId;
        if (!isRelated) return prev;
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      // Update sidebar - optimize by updating locally instead of refetching all
      setConversations((prev) => {
        const updatedConvs = [...prev];
        const msgSender = msg.from;
        const existingIdx = updatedConvs.findIndex(c => c.user === msgSender);
        
        if (existingIdx !== -1) {
          // Update existing conversation
          updatedConvs[existingIdx].message = msg;
          // Move to top
          const removed = updatedConvs.splice(existingIdx, 1);
          return [...removed, ...updatedConvs];
        } else {
          // New conversation - fetch user details
          const fetchNewUser = async () => {
            const chatSvc = ChatService.getInstance();
            const details = await chatSvc.getUser(msgSender);
            setConversations(prev => {
              const found = prev.find(c => c.user === msgSender);
              if (found) return prev;
              return [{ user: msgSender, message: msg, userDetails: details }, ...prev];
            });
          };
          fetchNewUser();
          return prev;
        }
      });
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [socket, activeUserId]);

  useEffect(() => {
    if (!activeUserId) return;
    const fetchHistory = async () => {
      const chatSvc = ChatService.getInstance();
      const history = await chatSvc.getMessages(activeUserId);
      setMessages(history.reverse());
    };
    fetchHistory();
  }, [activeUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUserId) return;

    const textToSend = inputText;
    setInputText("");
    const chatSvc = ChatService.getInstance();
    const sentMsg = await chatSvc.sendMessage(activeUserId, textToSend);

    if (sentMsg) {
      setMessages((prev) => {
         if (prev.find(m => m._id === sentMsg._id)) return prev;
         return [...prev, sentMsg];
      });
      setConversations(prev => {
        const update = [...prev];
        const idx = update.findIndex(c => c.user === activeUserId);
        if (idx !== -1) {
           update[idx].message = sentMsg;
        }
        return update;
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] w-full bg-card rounded-xl border overflow-hidden shadow-sm">
      <div className="w-80 border-r flex flex-col bg-muted/10">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">Tin nhắn</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-sm text-muted-foreground text-center">Không có cuộc trò chuyện nào</div>
          ) : (
            conversations.map((conv) => {
               const isActive = activeUserId === conv.user;
               const d = conv.userDetails;
               let avatar = "https://i.sstatic.net/l60Hf.png"; // Fallback URL
               if (d?.avatarUrl) {
                  avatar = d.avatarUrl.startsWith('http') ? d.avatarUrl : `${SOCKET_URL}/${d.avatarUrl}`;
               }
               return (
                 <button 
                   key={conv.user}
                   onClick={() => setActiveUserId(conv.user)}
                   className={`w-full flex items-center p-4 gap-3 border-b border-transparent hover:bg-muted/50 transition-colors text-left ${isActive ? 'bg-muted' : ''}`}
                 >
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                     <img src={avatar} alt="ava" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-semibold text-sm truncate">{d?.fullName || d?.username || 'Khách hàng'}</p>
                     <p className="text-xs text-muted-foreground truncate">{conv.message.messageContent?.text}</p>
                   </div>
                 </button>
               );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-background">
        {activeUserId ? (
          <>
            <div className="p-5 border-b bg-card flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                 {(() => {
                   const c = conversations.find(c => c.user === activeUserId);
                   const d = c?.userDetails;
                   let avatar = "https://i.sstatic.net/l60Hf.png";
                   if (d?.avatarUrl) {
                      avatar = d.avatarUrl.startsWith('http') ? d.avatarUrl : `${SOCKET_URL}/${d.avatarUrl}`;
                   }
                   return <img src={avatar} alt="ava" className="w-full h-full object-cover" />;
                 })()}
              </div>
              <h3 className="font-bold text-lg">
                {conversations.find(c => c.user === activeUserId)?.userDetails?.fullName || 'Khách hàng'}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => {
                const isMine = m.from === user?._id;
                return (
                  <div key={m._id || i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl max-w-[70%] ${isMine ? 'bg-primary text-primary-foreground rounded-br-sm shadow-md' : 'bg-muted text-foreground rounded-bl-sm border shadow-sm'}`}>
                      {m.messageContent?.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t flex space-x-3 bg-card shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập tin nhắn đễ hỗ trợ khách hàng..." 
                className="flex-1 px-5 py-3 text-sm bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-md"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare size={72} className="opacity-20 mb-6" />
            <h2 className="text-xl font-bold opacity-60">Trung tâm hỗ trợ</h2>
            <p className="opacity-50 mt-2">Chọn một đoạn chat bên trái để bắt đầu hồi đáp</p>
          </div>
        )}
      </div>
    </div>
  );
}
