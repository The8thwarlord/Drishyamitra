import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I am Drishyamitra\'s AI assistant. You can ask me to search for photos of specific people or request to deliver photos to someone via Email or WhatsApp.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: response.reply || response.response || 'Action completed successfully.' 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: 'Sorry, I encountered an error processing your request.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden border-white/5 bg-white/[0.02]">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center gap-4 bg-gradient-to-r from-violet-900/40 to-transparent relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full" />
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl border border-violet-400/30 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
           <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-lg text-white tracking-tight text-gradient">AI Assistant</h3>
          <p className="text-xs text-violet-300 flex items-center gap-1.5 font-medium">
             <Sparkles className="w-3 h-3 text-fuchsia-400" /> Powered by Groq
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-auto mb-1 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-[0_0_10px_rgba(56,189,248,0.4)]' 
                  : 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-[0_0_10px_rgba(139,92,246,0.4)]'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              
              <div className={`py-3 px-4 shadow-xl backdrop-blur-md ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl rounded-br-sm border border-blue-400/30' 
                  : msg.isError 
                    ? 'bg-red-500/20 text-red-200 border border-red-500/50 rounded-2xl rounded-bl-sm'
                    : 'bg-white/5 text-gray-100 border border-white/10 rounded-2xl rounded-bl-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-violet-300/70 p-2 ml-11">
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            <span className="text-sm italic tracking-wide">Processing query...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <form onSubmit={handleSend} className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Drishyamitra..."
            className="w-full glass-input py-3.5 pr-14 pl-5 rounded-xl text-sm transition-all focus:bg-white/10"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-0 opacity-100 transition-all shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_15px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
