"use client"
import React, { useState, useRef, useEffect } from 'react';
import Profile from '@/components/profile';
 import { Send, Paperclip, Sparkles, Image as ImageIcon, FileText, X, ChevronDown, Zap, Brain, Cpu, Menu, Plus } from 'lucide-react';
import { useUser } from '@/context/user';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: File[];
  timestamp: Date;
}

interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const models: Model[] = [
  {
    id: 'hsgpt-ultra',
    name: 'HSGPT Ultra',
    description: 'Most capable model for complex tasks',
    icon: <Brain className="model-icon" />
  },
  {
    id: 'hsgpt-pro',
    name: 'HSGPT Pro',
    description: 'Balanced performance and speed',
    icon: <Zap className="model-icon" />
  },
  {
    id: 'hsgpt-fast',
    name: 'HSGPT Fast',
    description: 'Quick responses for simple tasks',
    icon: <Cpu className="model-icon" />
  }
];

export default function Page() {
  const user = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState(models[1]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelSelector(false);
      }
    }

    if (showModelSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showModelSelector]);

  const handleSend = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setSelectedFiles([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've received your message${selectedFiles.length > 0 ? ` with ${selectedFiles.length} file(s)` : ''}. This is a demo response from ${selectedModel.name}. In a real implementation, this would connect to your AI backend.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <span className="logo-text">HSGPT</span>
          </div>
          <button className="new-chat-btn">
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="chat-history">
            <p className="history-label">Recent Chats</p>
            <div className="history-item active">
              <span>Current Conversation</span>
            </div>
            <div className="history-item">
              <span>Previous Chat Example</span>
            </div>
          </div>
        </div>

        <Profile user={user}  />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile Header */}
        <header className="mobile-header">
          <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <div className="mobile-logo">
            <Sparkles className="mobile-logo-icon" />
            <span className="mobile-logo-text">HSGPT</span>
          </div>
          <div style={{ width: '40px' }} /> {/* Spacer for centering */}
        </header>

        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Sparkles size={48} />
              </div>
              <h1 className="empty-title">Welcome to HSGPT</h1>
              <p className="empty-subtitle">Start a conversation with our AI assistant</p>
              <div className="suggestion-grid">
                <button className="suggestion-card" onClick={() => setInputValue("Help me write a professional email")}>
                  <span className="suggestion-emoji">✉️</span>
                  <span className="suggestion-text">Help me write a professional email</span>
                </button>
                <button className="suggestion-card" onClick={() => setInputValue("Explain quantum computing simply")}>
                  <span className="suggestion-emoji">🔬</span>
                  <span className="suggestion-text">Explain quantum computing simply</span>
                </button>
                <button className="suggestion-card" onClick={() => setInputValue("Create a workout plan for beginners")}>
                  <span className="suggestion-emoji">💪</span>
                  <span className="suggestion-text">Create a workout plan for beginners</span>
                </button>
                <button className="suggestion-card" onClick={() => setInputValue("Help me brainstorm ideas")}>
                  <span className="suggestion-emoji">💡</span>
                  <span className="suggestion-text">Help me brainstorm ideas</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === 'assistant' ? (
                      <Sparkles size={20} />
                    ) : (
                      'U'
                    )}
                  </div>
                  <div className="message-content">
                    {message.files && message.files.length > 0 && (
                      <div className="message-files">
                        {message.files.map((file, idx) => (
                          <div key={idx} className="message-file">
                            {file.type.startsWith('image/') ? (
                              <ImageIcon size={16} />
                            ) : (
                              <FileText size={16} />
                            )}
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">
                    <Sparkles size={20} />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="input-container">
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              {selectedFiles.map((file, index) => (
                <div key={index} className="selected-file">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                  <span className="file-name">{file.name}</span>
                  <button
                    className="remove-file"
                    onClick={() => removeFile(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="input-wrapper">
            <button
              className="icon-button attach-button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <textarea
              ref={textareaRef}
              className="message-input"
              placeholder="Message HSGPT..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            <div className="input-actions">
              <div className="model-selector-wrapper" ref={modelDropdownRef}>
                <button
                  className="model-selector-button"
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  title="Select model"
                >
                  {selectedModel.icon}
                  <ChevronDown className={`dropdown-icon ${showModelSelector ? 'open' : ''}`} size={16} />
                </button>

                {showModelSelector && (
                  <div className="model-dropdown">
                    {models.map(model => (
                      <button
                        key={model.id}
                        className={`model-option ${selectedModel.id === model.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelSelector(false);
                        }}
                      >
                        {model.icon}
                        <div className="model-option-info">
                          <span className="model-option-name">{model.name}</span>
                          <span className="model-option-desc">{model.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className={`icon-button send-button ${inputValue.trim() || selectedFiles.length > 0 ? 'active' : ''}`}
                onClick={handleSend}
                disabled={!inputValue.trim() && selectedFiles.length === 0}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          <p className="input-footer">
            HSGPT can make mistakes. Check important info.
          </p>
        </div>
      </main>
    </div>
  );
}

