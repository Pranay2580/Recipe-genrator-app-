
import React, { useState, useEffect, useRef } from 'react';
import type { Recipe } from '../types';
import { createChefChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";

interface ChefChatProps {
    recipe: Recipe;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const ChefChat: React.FC<ChefChatProps> = ({ recipe }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `Hi! I'm your AI Chef. Ask me anything about cooking ${recipe.recipeName}!` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            chatRef.current = createChefChat(recipe);
        } catch (e) {
            console.error("Failed to init chat", e);
        }
    }, [recipe]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: userMsg });
            const text = response.text || "I'm sorry, I couldn't understand that.";
            setMessages(prev => [...prev, { role: 'model', text }]);
        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the kitchen right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-orange-50 rounded-xl border border-orange-100 overflow-hidden flex flex-col h-[400px]">
            <div className="bg-orange-100 p-3 border-b border-orange-200 flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-full">
                    <span className="text-xl">👨‍🍳</span>
                </div>
                <div>
                    <h4 className="font-bold text-orange-800 text-sm">Ask the Chef</h4>
                    <p className="text-xs text-orange-600">Expert help for {recipe.recipeName}</p>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                            msg.role === 'user' 
                                ? 'bg-orange-500 text-white rounded-tr-none' 
                                : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-100 flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about substitutes, steps..."
                        className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};