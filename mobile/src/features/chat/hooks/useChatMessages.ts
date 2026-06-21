import { useState, useEffect } from "react";
import { socket, connectSocket } from "../../../services/api/socket";
import api from "../../../services/api/axios.instance";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  type?: "TEXT" | "IMAGE";
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
        type: msg.type || "TEXT",
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
              type: msg.type || "TEXT",
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

  const sendImageMessage = async (imageUri: string) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const filename = imageUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const response = await api.post("/comments/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data;

      const newMessageData = {
        conversationId: conversationId,
        senderId: user.id,
        senderRole: "user",
        content: imageUrl,
        type: "IMAGE",
      };

      socket.emit("send-message", newMessageData);
    } catch (error) {
      console.error("Failed to upload and send image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    sendImageMessage,
    setMessages
  };
};
