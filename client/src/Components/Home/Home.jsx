import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function formatTime(timeString) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Date(timeString).toLocaleTimeString([], options);
}

function Home() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8088/chatbot", { query });
      const response = res.data.response;

      // Update the chat history with the user query and chatbot response
      const newChat = {
        sender: "User",
        message: query,
        time: formatTime(new Date()), // Get the current time
      };
      setChatHistory((prevHistory) => [...prevHistory, newChat]);

      const chatbotReply = {
        sender: "Chatbot",
        message: response,
        time: formatTime(new Date()), // Get the current time
      };
      setChatHistory((prevHistory) => [...prevHistory, chatbotReply]);

      // Clear the input field
      setQuery("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container when chat history updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="chat-page">
      <h1>Chatbot</h1>
      <div className="chat-container" ref={chatContainerRef}>
        {chatHistory.map((chat, index) => (
          <div
            className={`chat ${
              index === chatHistory.length - 1 ? "chat-start" : "chat-start"
            } `}
            key={index}
          >
            <div className="chat-image avatar">
              <div className="w-10  rounded-full">
                <img
                  src={
                    chat.sender === "User"
                      ? "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG.png"
                      : "https://www.clipartmax.com/png/middle/344-3448992_arag-avatar-chatbot.png"
                  }
                  alt="Avatar"
                />
              </div>
            </div>
            <div className=" chat-header">
              {chat.sender}
              <time className="text-xs opacity-50">{chat.time}</time>
            </div>
            <div className="chat-bubble">{chat.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Home;
