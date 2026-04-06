import { useState, useRef, useEffect, useCallback } from "react";
import { aiApi, Message } from "../../../services/api/api-ai";

export const useAiChat = (user: any, initialMsg: string | null) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Xin chào! Tôi là trợ lý AI. Bạn muốn tìm món ăn như thế nào? (Ví dụ: 'Tôi muốn ăn gà')",
            isMe: false,
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const isMounted = useRef(false);
    const componentIsMounted = useRef(true);

    useEffect(() => {
        return () => {
            componentIsMounted.current = false;
        };
    }, []);

    const sendMessageWithText = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            isMe: true,
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const response = await aiApi.chat(text, user?.id);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                isMe: false,
                product: response.product,
                productId: response.productId,
                suggestions: response.suggestions,
                recommendedProducts: response.recommendedProducts
            };
            if (componentIsMounted.current) {
                setMessages((prev) => [...prev, aiMsg]);
            }
        } catch (error) {
            if (componentIsMounted.current) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: "err",
                        text: "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu.",
                        isMe: false,
                    },
                ]);
            }
        } finally {
            if (componentIsMounted.current) {
                setIsTyping(false);
            }
        }
    }, [user?.id]);

    const handleInitialChat = useCallback(async (text: string) => {
        const userMsg: Message = { id: Date.now().toString(), text: text, isMe: true };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        try {
            const response = await aiApi.chat(text, user?.id);
            if (componentIsMounted.current) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    text: response.text,
                    isMe: false,
                    product: response.product,
                    productId: response.productId,
                    suggestions: response.suggestions,
                    recommendedProducts: response.recommendedProducts
                }]);
            }
        } catch (error) {
            if (componentIsMounted.current) {
                setMessages(prev => [...prev, { id: 'err', text: "Lỗi kết nối AI.", isMe: false }]);
            }
        } finally {
            if (componentIsMounted.current) {
                setIsTyping(false);
            }
        }
    }, [user?.id]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?.id) {
                try {
                    setIsTyping(true);
                    const history = await aiApi.getHistory(user.id);
                    if (history && history.length > 0) {
                        const historyMsgs: Message[] = [];
                        history.forEach((h: any) => {
                            historyMsgs.push({
                                id: h.id + "_q",
                                text: h.query,
                                isMe: true
                            });
                            historyMsgs.push({
                                id: h.id + "_r",
                                text: h.response,
                                isMe: false,
                                type: h.type,
                                recommendedProducts: h.products
                                    ? (typeof h.products === 'string' ? JSON.parse(h.products) : h.products)
                                    : []
                            });
                        });
                        if (componentIsMounted.current) {
                            setMessages((prev) => [...prev, ...historyMsgs]);
                        }
                    }
                } catch (error) {
                    // Fail silently for history
                } finally {
                    if (componentIsMounted.current) {
                        setIsTyping(false);
                    }
                }
            }
        };

        fetchHistory();

        if (!isMounted.current && initialMsg) {
            isMounted.current = true;
            handleInitialChat(initialMsg);
        }
    }, [user?.id, initialMsg, handleInitialChat]);

    return {
        messages,
        isTyping,
        sendMessageWithText
    };
};
