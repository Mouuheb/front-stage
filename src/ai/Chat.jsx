import React, { useState } from "react";
import './chat.css';
import data from "../data/data";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = { role: "assistant", content: data.reply };

      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="chat-page">
      <h2>{data.chat.title}</h2>
      

      <div className="top">
        {messages.map((msg, index) => (
          <div className="message" key={index} >
            {msg.content}
          </div>
        ))}
      </div>
      <hr/>
        
      <div className="footer" >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={data.chat.placeholder}
          
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="click-btn2" onClick={sendMessage}>{data.chat.btn2Txt}</button>
      </div>
    </div>
  );
};

export default Chat;