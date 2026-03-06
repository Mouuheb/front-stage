import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './conversation.css'
import data from '../data/data';
import { fetchWithAuth } from './../auth/api';

const API_BASE_URL = 'http://localhost:8000/api';

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/clt/login');
        return;
      }

      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/conversations/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            navigate('/clt/login');
          }
          throw new Error('Failed to load conversations');
        }

        const data = await response.json();
        setConversations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [navigate]);

  const handleCreateConversation = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/clt/login');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/conversations/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participant_ids: [] }), // creates conversation with just current user
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create conversation');
      }

      const newConversation = await response.json();
      // Redirect to the new conversation detail page
      navigate(`/conversations/${newConversation.id}`);
    } catch (err) {
      setError(err.message);
      setCreating(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>{data.conversation.loadmessage}</div>;

  return (
    <div className='conversation-main-page'>
      <h2>{data.conversation.title}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {conversations.length === 0 ? (
        
        <div >
          <p>{data.conversation.noCnvMess}</p>
          <button
            onClick={handleCreateConversation}
            disabled={creating}
          >
            {creating ? data.conversation.creating : data.conversation.startCnv}
          </button>
        </div>
        
        
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {conversations.map((conv) => (
            <li key={conv.id} className='click-btn' >
              <Link to={`/conversations/${conv.id}`} >
                <strong>{data.conversation.cnvId} : {conv.id}</strong>
                <br />
                <small>
                  {data.conversation.cnvParticipants}:{' '}
                  {conv.participants?.map((p) => p.username).join(', ') || data.conversation.unknown}
                </small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;