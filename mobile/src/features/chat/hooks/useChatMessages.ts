import { useState, useEffect } from "react";
import { socket, connectSocket } from "../../../services/api/socket";
import api from "../../../services/api/axios.instance";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export const useChatMessages = (user: any, conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/chat/messages/${conversationId}`);
      const history = response.data.map((msg: any) => ({
        id: msg.id.toString(),
        text: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt,
      }));
      setMessages(history);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && conversationId) {
      fetchHistory();
      connectSocket(user.id);

      socket.emit("join-room", { conversationId });

      socket.off("new-message");

      socket.on("new-message", (msg: any) => {
        if (msg.conversationId === conversationId) {
          setMessages((prev) => {
            const exists = prev.find(m => m.id === msg.id.toString());
            if (exists) return prev;

            const formattedMsg: Message = {
              id: msg.id.toString(),
              text: msg.content,
              senderId: msg.senderId,
              createdAt: msg.createdAt,
            };
            return [...prev, formattedMsg];
          });
        }
      });
    }

    return () => {
      socket.emit("leave-room", { conversationId });
      socket.off("new-message");
    };
  }, [user?.id, conversationId]);

  const sendMessage = (text: string) => {
    if (!text.trim() || !user?.id) return;

    const newMessageData = {
      conversationId: conversationId,
      senderId: user.id,
      senderRole: "user",
      content: text.trim(),
      type: "TEXT",
    };

    socket.emit("send-message", newMessageData);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    setMessages
  };
};
