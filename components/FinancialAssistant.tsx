
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader, MessageCircle } from 'lucide-react';
import type { Message } from '../types';
import { useMockData } from '../hooks/useMockData';
import { getAIAssistantResponse } from '../services/geminiService';


const FinancialAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const financialData = useMockData();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if(isOpen) {
            setMessages([{ sender: 'ai', text: 'Hello! How can I help you with your financial data today?' }]);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !financialData) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await getAIAssistantResponse(input, financialData);
        
        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                aria-label="Toggle Financial Assistant"
            >
                {isOpen ? <X className="h-6 w-6"/> : <MessageCircle className="h-6 w-6" />}
            </button>
            {isOpen && (
                 <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border border-slate-200">
                    <div className="p-4 border-b flex items-center bg-slate-50 rounded-t-xl">
                        <Bot className="h-6 w-6 text-cyan-600" />
                        <h3 className="ml-2 text-lg font-semibold text-slate-800">AI Financial Assistant</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                       {messages.map((msg, index) => (
                           <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                               {msg.sender === 'ai' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white"><Bot size={18}/></div>}
                               <div className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-sm ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                   <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                               </div>
                           </div>
                       ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white"><Bot size={18}/></div>
                                <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none">
                                    <Loader className="h-5 w-5 animate-spin text-slate-500" />
                                </div>
                            </div>
                        )}
                       <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t bg-white rounded-b-xl">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask about finances..."
                                className="w-full pr-12 pl-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-cyan-600 text-white p-2 rounded-full hover:bg-cyan-700 disabled:bg-cyan-300 transition-colors"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FinancialAssistant;
