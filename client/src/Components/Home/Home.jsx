import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

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
        sender: "Bot",
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
    <div className="chat-page bg-gray-800  dark:bg-gray-200 relative">
      <div>
        <div className="chat-container h-screen mx-6" ref={chatContainerRef}>
          {chatHistory.map((chat, index) => (
            <div
              className={`chat ${
                chat.sender === "User"
                  ? "chat-end lg:w-[1/2]"
                  : "chat-start lg:w-1/2"
              }`}
              key={index}
            >
              <div className="chat-image avatar">
                <div className="w-10 border-2 border-gray-200 dark:border-gray-800 rounded-full">
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
              <div
                className={`text-gray-200 dark:text-gray-800 chat-header ${
                  chat.sender === "User"
                    ? "flex flex-row-reverse gap-2"
                    : "flex gap-2"
                }`}
              >
                {chat.sender}
                <time className="text-xs opacity-50">{chat.time}</time>
              </div>
              <div
                className={`chat-bubble ${
                  chat.sender === "User" ? "bg-rose-500" : "bg-blue-500"
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 dark:bg-gray-200 sticky bottom-0 left-0 right-0">
          <form
            onSubmit={handleSubmit}
            className="message-input  flex justify-center w-auto "
          >
            <input
              className="w-3/4 rounded block placeholder:text-center placeholder:flex placeholder:items-center placeholder:justify-center placeholder:text-gray-800 dark:placeholder:text-gray-200 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">
              <Icon
                className="w-6 h-6 text-gray-200 dark:text-gray-800"
                icon="mingcute:send-fill"
              />
            </button>
          </form>
          <p className="flex ml-24 lg:justify-center lg:mr-40 text-gray-200 dark:text-gray-800">
            powered by OpenAI
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
