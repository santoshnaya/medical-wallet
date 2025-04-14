'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Bot, User, Send, X, Minimize2, Maximize2 } from 'lucide-react';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.0-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    maxOutputTokens: 2048,
  },
});

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const prompt = {
        contents: [{
          parts: [{
            text: `You are a medical assistant chatbot for our medical wallet application. 
            You help users with medical records, appointments, medications, and general health queries.
            Keep responses concise and professional.
            
            Current question: ${userMessage}`
          }]
        }]
      };

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      setMessages(prev => [...prev, { role: 'bot', content: text }]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'API key error. Please check your configuration.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        }
      }
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-xl w-96 transition-all ${
      isMinimized ? 'h-14' : 'h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <h3 className="font-semibold">Medical Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-700 rounded"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">
                <Bot className="h-12 w-12 mx-auto mb-2" />
                <p>Hi! How can I help you today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 