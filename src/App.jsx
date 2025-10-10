import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";
import logo from "./heartchat-logo.svg";

const SERVER = import.meta.env.VITE_API_URL || "https://heartchat-backend.onrender.com";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // ✅ Connect to backend socket
    const newSocket = io(SERVER, {
      transports: ["websocket"],
      withCredentials: false,
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to server:", newSocket.id);
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setConnected(false);
    });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (socket && text.trim() !== "") {
      const message = { text, time: new Date().toLocaleTimeString() };
      socket.emit("sendMessage", message);
      setText("");
    }
  };

  return (
    <div className="app">
      <header>
        <img src={logo} alt="HeartChat Logo" className="logo" />
        <h1>❤️ HeartChat</h1>
        <p>{connected ? "🟢 Connected" : "🔴 Not connected"}</p>
      </header>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span>{msg.text}</span>
            <small>{msg.time}</small>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
