import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './conversation.css'
import ConversationList from './Conversation';
import data from '../data/data';
import { fetchWithAuth } from '../auth/api';
const API_BASE_URL = 'http://localhost:8000/api';

const ConversationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Get current user from localStorage (set after login)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/conversations/${id}/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('You do not have permission to view this conversation.');
          }
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            navigate('/login');
          }
          throw new Error('Failed to load messages');
        }

        const data = await response.json();
        setMessages(data);

        // Mark messages as read (background)
        fetchWithAuth(`${API_BASE_URL}/conversations/${id}/mark-read/`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => console.warn('Failed to mark messages as read', err));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setSending(true);
    try {
      // Send payload with sender_id and content
      const response = await fetch(`${API_BASE_URL}/conversations/${id}/send-message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_id: currentUserId,
          content: newMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Extract error message from response (field errors or non_field_errors)
        const message = errorData.non_field_errors?.[0] ||
          Object.values(errorData).flat()[0] ||
          'Failed to send message';
        throw new Error(message);
      }

      const sentMessage = await response.json();
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // Helper to determine if a message was sent by the current user
  const isMyMessage = (message) => {
    // message.sender could be an object with id, or a direct sender_id
    if (typeof message.sender === 'object' && message.sender !== null) {
      return message.sender.id === currentUserId;
    }
    return message.sender === currentUserId;
  };

  // Helper to get sender's display name
  const getSenderName = (message) => {
    if (typeof message.sender === 'object' && message.sender !== null) {
      return message.sender.username || 'Unknown';
    }
    // If sender is just an ID, maybe we stored sender_username separately?
    return message.sender_username || `User ${message.sender}`;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading messages...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;

  return (
    <div className='conversationDetail-main-page main-cnt-div'>
      <div className='p1' >
        <ConversationList />

      </div>
      <hr />
      <div className='p2' >
        <div className='messages-cnt'>
          <h1>{data.conversation.cnvId} : {id}</h1>
          <div className='messages' >
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: '10px', textAlign: isMyMessage(msg) ? 'right' : 'left' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '15px',
                  backgroundColor: isMyMessage(msg) ? '#007bff' : '#e9ecef',
                  color: isMyMessage(msg) ? '#fff' : '#000',
                  maxWidth: '70%',
                  wordWrap: 'break-word'
                }}>
                  <strong>{getSenderName(msg)}:</strong> {msg.content || msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage}>
            <div className='footer-message'>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={data.conversation.placeholder}
                
                disabled={sending}
              />
              <button type="submit" disabled={sending} className='click-btn2' >
                {sending ? data.conversation.sending : data.conversation.send}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>

  );
};

export default ConversationDetail;