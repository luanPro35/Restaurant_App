'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Conversation, ChatMessage } from '../../types';
import apiService from '../../services/api';
import { MessageSquare, Send, Sparkles, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';

export default function LiveChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isImageUrl = (url: string) => {
    if (!url) return false;
    const trimmed = url.trim();
    return (
      (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
      (/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(trimmed) || trimmed.includes('cloudinary.com'))
    );
  };

  const fetchChatData = async () => {
    try {
      setLoading(true);
      const convs = await apiService.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConv) {
        setActiveConv(convs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, []);

  useEffect(() => {
    if (activeConv) {
      apiService.getMessages(activeConv.id).then((msgs) => {
        setMessages(msgs);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
    }
  }, [activeConv]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    const msg = await apiService.sendMessage(activeConv.id, inputText.trim());
    setMessages((prev) => [...prev, msg]);
    setInputText('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const quickReplies = [
    'Dạ món ăn của bàn mình đang được đầu bếp phục vụ ngay ạ!',
    'Dạ quán xin ghi nhận yêu cầu và sẽ hỗ trợ anh/chị ngay ạ.',
    'Dạ bàn VIP của mình đã được giữ chỗ thành công ạ.',
    'Dạ cảm ơn anh/chị đã gửi hình ảnh, nhân viên sẽ kiểm tra ngay ạ.',
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#E07B39]" />
            Chat Trực Tuyến Với Khách Hàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hỗ trợ giải đáp thực khách trực tiếp từ ứng dụng di động Dolin theo thời gian thực.
          </p>
        </div>

        <button
          onClick={fetchChatData}
          disabled={loading}
          className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-600 transition-colors shadow-sm"
          title="Tải lại cuộc trò chuyện"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Split Chat View */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-0">
        {/* Left Column: Conversations List */}
        <div className="w-full md:w-80 shrink-0 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800">Khách đang nhắn ({conversations.length})</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-orange-50/80 border-l-4 border-l-[#E07B39]' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#E07B39]/10 text-[#E07B39] font-bold text-sm flex items-center justify-center shrink-0">
                    {conv.userName.charAt(0) || 'K'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{conv.userName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageAt}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate flex items-center gap-1">
                      {isImageUrl(conv.lastMessage) ? (
                        <>
                          <ImageIcon className="w-3.5 h-3.5 text-[#E07B39] shrink-0" />
                          <span className="text-[#E07B39] font-medium">[Hình ảnh]</span>
                        </>
                      ) : (
                        conv.lastMessage || 'Đoạn hội thoại mới'
                      )}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#E07B39] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation Messages */}
        {activeConv ? (
          <div className="flex-1 flex flex-col justify-between bg-white min-w-0 min-h-0">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#E07B39] font-bold text-sm flex items-center justify-center shrink-0">
                  {activeConv.userName.charAt(0) || 'K'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{activeConv.userName}</h3>
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Đang online trên Dolin Mobile App
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
              {messages.map((msg) => {
                const isAdmin = msg.senderRole === 'ADMIN' || msg.senderRole === 'STAFF';
                const hasImage = isImageUrl(msg.message);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] font-medium text-slate-400 mb-1 px-1">
                      {msg.senderName} • {msg.createdAt}
                    </span>

                    {hasImage ? (
                      <div className="group relative max-w-xs sm:max-w-md rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white p-1 cursor-pointer hover:shadow-md transition-shadow">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.message.trim()}
                          alt="Ảnh đính kèm"
                          className="w-full max-h-72 object-contain rounded-xl bg-slate-100"
                          onClick={() => setSelectedImage(msg.message.trim())}
                        />
                        <div
                          onClick={() => setSelectedImage(msg.message.trim())}
                          className="absolute inset-1 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-semibold gap-1.5"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Bấm để phóng to</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm leading-relaxed ${
                          isAdmin
                            ? 'bg-[#E07B39] text-white rounded-tr-none'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Reply Suggestions */}
            <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#E07B39]" /> Gợi ý nhanh:
              </span>
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(qr)}
                  className="text-xs bg-white border border-slate-200 hover:border-orange-300 hover:text-[#E07B39] text-slate-600 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs shrink-0"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex items-center gap-3 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập nội dung phản hồi khách hàng..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-5 py-2.5 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Chọn một cuộc hội thoại để bắt đầu hỗ trợ
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Ảnh phóng to"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            <div className="p-3 flex items-center justify-between bg-white">
              <span className="text-xs font-medium text-slate-500">Ảnh gửi từ khách hàng</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(selectedImage, '_blank')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở ảnh gốc
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-3 py-1 bg-[#E07B39] text-white rounded-lg text-xs font-semibold hover:bg-orange-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
