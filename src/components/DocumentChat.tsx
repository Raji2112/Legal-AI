import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Quote, BookOpen, Sparkles, Copy, Check, Trash2, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types.js";

interface DocumentChatProps {
  documentName: string;
  documentText: string;
}

const SUGGESTED_QUESTIONS = [
  "What are the termination conditions and notice periods?",
  "What is the liability cap or indemnification obligation?",
  "Does this agreement automatically renew?",
  "What are the payment terms, deadlines, and penalties?",
  "Which jurisdiction and governing law applies?",
  "What happens if one party breaches confidentiality?",
];

export const DocumentChat: React.FC<DocumentChatProps> = ({
  documentName,
  documentText,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `Hello! I have reviewed **${documentName}**. You can ask me any question about the terms, clauses, obligations, penalties, or deadlines. I will provide direct quotations and references from the contract text whenever available.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAsking]);

  const handleSend = async (queryText?: string) => {
    const question = (queryText || inputQuestion).trim();
    if (!question || isAsking) return;

    setInputQuestion("");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAsking(true);

    try {
      const response = await fetch("/api/ask-document-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          documentName,
          question,
          chatHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ Failed to answer question: ${err?.message || "Connection error"}. Please verify server status or try rephrasing your query.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `Chat history cleared. You may continue asking questions about **${documentName}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[650px] rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C5A880]/20 border border-[#C5A880]/30 flex items-center justify-center text-[#E5C378]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Ask Document Assistant</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Grounded to {documentName}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Answers are strictly anchored to the uploaded contract text
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="Clear conversation"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Starter Questions Bar */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-[#E5C378] flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3" />
          <span>Quick Prompts:</span>
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isAsking}
            className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-800 hover:text-white border border-slate-700/80 text-[11px] text-slate-300 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? "bg-[#1E3A8A] text-white border border-blue-400/40"
                    : "bg-slate-800 text-[#E5C378] border border-[#C5A880]/30"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-[#1E3A8A] text-white rounded-tr-none"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isUser ? "You" : "LexiScan AI"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="italic flex items-center gap-1 text-slate-400">
                      <Quote className="w-3 h-3 text-[#C5A880]" />
                      <span>Document grounded</span>
                    </span>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isAsking && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-[#E5C378] border border-[#C5A880]/30 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-800/80 border border-slate-700/80 p-3.5 text-xs text-slate-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E5C378] animate-ping" />
              <span>Analyzing contract clauses for answers...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about this legal document (e.g., penalty rates, termination notice, IP ownership)..."
          disabled={isAsking}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#C5A880] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isAsking || !inputQuestion.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-slate-950 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all font-semibold shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
