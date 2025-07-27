import { useState, useEffect, useRef } from 'react'

function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ai-chat-messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const lastAiMsgRef = useRef(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (
        window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function'
      ) {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300)
    return () => clearInterval(checkReady);
  }, [])
  useEffect(() => {
    // Scroll to the latest AI message if it exists, else to the end
    setTimeout(() => {
      if (lastAiMsgRef.current) {
        lastAiMsgRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }, [messages]);
  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save messages to localStorage:', err);
    }
  }, [messages]);

  const addMessages = (msg, isUser) => {
    setMessages((prev) => [
      ...prev,
      {
        content: msg,
        isUser,
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem('ai-chat-messages');
    } catch (err) {
      console.error('Failed to remove messages from localStorage:', err);
    }
  }
  const sendMessage = async () => {
    const message = input.trim();
    if (!message) return;
    if (!aiReady) {
      addMessages('AI is not ready yet. Please wait...', false);
      return;
    }
    addMessages(message, true);
    setInput('');
    setLoading(true);
    try {
      const response = await window.puter.ai.chat(message);
      // Only add a string reply from the AI
      let reply = '';
      if (typeof response === 'string') {
        reply = response;
      } else if (response && typeof response.message?.content === 'string') {
        reply = response.message.content;
      } else {
        reply = 'No reply received.';
      }
      addMessages(reply, false);
    } catch (err) {
      addMessages(`Error: ${err.message || "something went wrong"}`, false);
    } finally {
      setLoading(false);
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-950 to-emerald-900 flex flex-col items-center justify-center text-white p-0 sm:p-4 gap-2 sm:gap-8 relative">
      {/* Header Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-900/80 rounded-b-2xl sm:rounded-b-3xl shadow-lg border-b border-emerald-700/30 mb-1 sm:mb-2 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">💬</span>
          <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Ai Chat App</span>
        </div>
        <button onClick={clearChat} className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500/80 to-sky-500/80 hover:opacity-80 text-white font-semibold shadow border border-emerald-300/30 transition">Clear Chat</button>
        <button className="ml-1 sm:ml-2 p-2 rounded-full hover:bg-gray-800/60 transition" title="About / Settings">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
        </button>
      </div>
      <div className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm ${aiReady && !isLoading ? "bg-green-500/20 text-green-300 border border-green-500/30 " : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20 "} transition-all duration-300 ease-in-out`}>
        {aiReady && !isLoading ? "🟢Ai Ready" : "🟡Waiting for Ai"}
      </div>
      <div className='w-full max-w-2xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md border border-gray-600 rounded-2xl sm:rounded-3xl p-2 sm:p-6 shadow-2xl'>
        <div className='h-72 sm:h-80 overflow-y-auto border-b border-gray-600/50 mb-4 sm:mb-6 p-2 sm:p-4 bg-gradient-to-b from-gray-900/50 to-gray-800/'>
          {
            messages.length === 0 && (
              <div className='text-center text-gray-400 mt-20'>
                start chatting with the Ai by typing your message below.
              </div>
            )
          }
          {messages.map((msg, idx) => {
            // If this is the last AI message, attach the ref
            const isLastAi = !msg.isUser &&
              messages.slice(idx + 1).findIndex(m => !m.isUser) === -1;
            return (
              <div key={msg.id} className={`my-2 sm:my-3 ${msg.isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'} animate-fadein`} ref={isLastAi ? lastAiMsgRef : null}>
                <div className={`flex items-end gap-1 sm:gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  {!msg.isUser && (
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center shadow-md border-2 border-emerald-300">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="7" width="16" height="10" rx="4" fill="#fff" fillOpacity="0.9" />
                        <rect x="8" y="3" width="8" height="4" rx="2" fill="#fff" fillOpacity="0.7" />
                        <circle cx="8.5" cy="12" r="1.2" fill="#22d3ee" />
                        <circle cx="15.5" cy="12" r="1.2" fill="#22d3ee" />
                        <rect x="10" y="15" width="4" height="1.2" rx="0.6" fill="#22d3ee" />
                        <rect x="2.5" y="10.5" width="1.5" height="3" rx="0.75" fill="#fff" fillOpacity="0.7" />
                        <rect x="20" y="10.5" width="1.5" height="3" rx="0.75" fill="#fff" fillOpacity="0.7" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[90vw] sm:max-w-[75%] px-3 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-lg border text-sm sm:text-base ${msg.isUser
                      ? 'bg-gradient-to-br from-blue-600/80 to-sky-500/80 text-white border-blue-400/40 rounded-br-md'
                      : 'bg-gradient-to-br from-gray-800/90 to-gray-700/80 text-emerald-100 border-emerald-400/30 rounded-bl-md'}
                      whitespace-pre-wrap`}
                  >
                    {msg.content}
                  </div>
                  {msg.isUser && (
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-sky-600 flex items-center justify-center shadow-md border-2 border-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26">
                        <circle cx="12" cy="8" r="4" fill="#fff" fillOpacity="0.9" />
                        <path d="M4 20c0-3.313 3.134-6 8-6s8 2.687 8 6v1H4v-1z" fill="#fff" fillOpacity="0.7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className={`mt-1 text-[11px] sm:text-xs font-medium flex items-center gap-2 ${msg.isUser ? 'text-blue-200 text-right pr-12 sm:pr-14 justify-end' : 'text-emerald-300 text-left pl-12 sm:pl-14 justify-start'} opacity-70 w-full`}>
                  <span>{msg.isUser ? 'You' : 'AI'}</span>
                  <span className="text-gray-400 text-[10px] sm:text-xs">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin shadow-lg"></div>
              <div className="absolute text-2xl text-emerald-300 drop-shadow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="7" width="16" height="10" rx="4" fill="#fff" fillOpacity="0.9" />
                  <rect x="8" y="3" width="8" height="4" rx="2" fill="#fff" fillOpacity="0.7" />
                  <circle cx="8.5" cy="12" r="1.2" fill="#22d3ee" />
                  <circle cx="15.5" cy="12" r="1.2" fill="#22d3ee" />
                  <rect x="10" y="15" width="4" height="1.2" rx="0.6" fill="#22d3ee" />
                  <rect x="2.5" y="10.5" width="1.5" height="3" rx="0.75" fill="#fff" fillOpacity="0.7" />
                  <rect x="20" y="10.5" width="1.5" height="3" rx="0.75" fill="#fff" fillOpacity="0.7" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-emerald-200 font-medium tracking-wide animate-pulse">AI is thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} >  </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-2xl mt-2 px-2 sm:px-0'>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={aiReady ? "Type your message..." : "Waiting for AI..."}
          disabled={!aiReady || isLoading}
          className='flex-1 px-3 sm:px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/60 focus:shadow-lg transition duration-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
        />
        <button onClick={sendMessage} disabled={!aiReady || isLoading || !input.trim()} className='w-full sm:w-auto cursor-pointer px-4 sm:px-6 py-3 bg-gradient-to-r from-sky-400 via-emerald-400 hover:opacity-80 rounded-2xl text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'>
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
              <span className='ml-2'>Sending...</span>
            </div>
          ) : (
            "Send"
          )}
        </button>
      </div>
      {/* Footer */}
      <footer className="w-full max-w-2xl mx-auto mt-6 mb-2 text-center text-xs text-gray-400 opacity-80 select-none">
        &copy; {new Date().getFullYear()} Yassine Samlali. All rights reserved.
      </footer>
      {/* Fade-in animation style */}
      <style>{`
        .animate-fadein {
          animation: fadein 0.5s;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        @media (max-width: 640px) {
          .h-72 { height: 60vh !important; }
        }
      `}</style>
    </div>
  )
}

export default App
