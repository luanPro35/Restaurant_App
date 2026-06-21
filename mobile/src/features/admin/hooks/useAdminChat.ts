import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api/axios.instance";
import { socket, connectSocket } from "../../../services/api/socket";

export const useAdminConversations = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get(`/chat/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, refreshing, onRefresh };
};

export const useAdminChatDetail = (conversationId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const adminId = "admin-1"; 

  const fetchHistory = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const response = await api.get(`/chat/messages/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchHistory();

    connectSocket(adminId);
    socket.emit("join-room", { conversationId });

    const handleNewMessage = (msg: any) => {
      // Ensure msg belongs to this conversation
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.emit("leave-room", { conversationId });
      socket.off("new-message", handleNewMessage);
    };
  }, [conversationId, fetchHistory]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    socket.emit("send-message", {
      conversationId,
      senderId: adminId,
      senderRole: "admin",
      content: content.trim(),
      type: "TEXT",
    });
  }, [conversationId]);

  const sendImageMessage = useCallback(async (imageUri: string) => {
    setIsSendingImage(true);
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

      socket.emit("send-message", {
        conversationId,
        senderId: adminId,
        senderRole: "admin",
        content: response.data,
        type: "IMAGE",
      });
    } catch (error) {
      console.error("Failed to upload and send image:", error);
    } finally {
      setIsSendingImage(false);
    }
  }, [conversationId]);

  return { messages, loading, isSendingImage, sendMessage, sendImageMessage, fetchHistory };
};
