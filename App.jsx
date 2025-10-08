/*
HeartChat — Frontend (Connected)
App.jsx
*/

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import api, { setAuthToken } from "./api";
import LogoSvg from "./heartchat-logo.svg?url";

let socket = null;
const SERVER = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Nav({ onNavigate, coins, theme, toggleTheme, onLogout, user }) {
  return (
    <nav
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={LogoSvg} alt="logo" style={{ height: 40 }} />
        <div style={{ fontWeight: 700, fontSize: 20 }}>HeartChat</div>
        {user && <div style={{ marginLeft: 12, color: "#777" }}>Hi, {user.name}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => onNavigate("landing")}>Home</button>
        <button onClick={() => onNavigate("match")}>Explore</button>
        <button onClick={() => onNavigate("chat")}>Chat</button>
        <button onClick={() => onNavigate("wallet")}>Wallet</button>

        <div
          style={{
            background: "linear-gradient(90deg,#FF3366,#9C27B0)",
            padding: "6px 10px",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          {coins} Coins
        </div>

        <button onClick={toggleTheme}>{theme === "light" ? "🌞" : "🌚"}</button>
        {user && <button onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}

function Landing({ onStart }) {
  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 40, margin: 0 }}>Find real love. Connect with your heart.</h1>
          <p style={{ color: "#666" }}>
            Meet verified people worldwide. Chat, call, and build meaningful relationships.
          </p>
          <div style={{ marginTop: 18 }}>
            <button
              onClick={() => onStart("match")}
              style={{
                background: "linear-gradient(90deg,#FF3366,#9C27B0)",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 999,
                border: "none",
              }}
            >
              Get Started
            </button>
            <button
              style={{
                marginLeft: 8,
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid #ccc",
              }}
            >
              How it works
            </button>
          </div>
        </div>

        <div style={{ width: 380 }}>
          <div
            style={{
              background: "linear-gradient(180deg,#fff 0%, #ffeef6 100%)",
              padding: 20,
              borderRadius: 18,
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src="https://i.pravatar.cc/60?img=5"
                style={{ height: 56, width: 56, borderRadius: 999 }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>Aisha, 27</div>
                <div style={{ fontSize: 12, color: "#777" }}>Lagos • Loves afrobeat & cooking</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#2ecc71" }}>Online</div>
            </div>

            <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 12 }}>
              <div style={{ color: "#666" }}>"Just had the best call! 💖"</div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button
                  style={{
                    background: "linear-gradient(90deg,#FF3366,#9C27B0)",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: 8,
                  }}
                >
                  Message
                </button>
                <button style={{ padding: "8px 12px", borderRadius: 8 }}>Call</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPage({ messages, onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend({ text });
    setText("");
  };

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <aside style={{ width: 260, borderRight: "1px solid #eee", paddingRight: 12 }}>
          <input
            placeholder="Find chats..."
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #eee" }}
          />
        </aside>

        <main style={{ flex: 1 }}>
          <div
            style={{
              height: 420,
              overflow: "auto",
              padding: 12,
              borderRadius: 12,
              background: "#fff",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: "70%",
                  marginLeft: m.me ? "auto" : 0,
                  background: m.me
                    ? "linear-gradient(90deg,#FF3366,#9C27B0)"
                    : "#f7f7f7",
                  color: m.me ? "#fff" : "#111",
                  padding: 10,
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              >
                <div>{m.text}</div>
                <div style={{ fontSize: 11, opacity: 0.7, textAlign: "right" }}>{m.time}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 999,
                border: "1px solid #eee",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: "linear-gradient(90deg,#FF3366,#9C27B0)",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: 999,
              }}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [theme, setTheme] = useState("light");
  const [coins, setCoins] = useState(1200);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    {
      text: "Welcome to HeartChat! 👋",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      me: false,
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("hc_token");
    if (token) {
      setAuthToken(token);
      connectSocket(token);
      api.get("/api/users/me").then((res) => setUser(res.data)).catch(() => {});
    }
  }, []);

  const connectSocket = (token) => {
    if (!token) return;
    socket = io(SERVER, { auth: { token } });
    socket.on("connect", () => {
      console.log("socket connected", socket.id);
      socket.emit("conversation:join", "demo-convo-1");
    });
    socket.on("chat:message", (payload) => {
      const msg = payload.message ? payload.message : payload;
      setMessages((m) => [
        ...m,
        {
          text: msg.text || JSON.stringify(msg),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          me: false,
        },
      ]);
    });
  };

  const handleSend = (payload) => {
    if (!socket) {
      alert("Not connected to server");
      return;
    }
    const msg = { conversationId: "demo-convo-1", text: payload.text };
    socket.emit("chat:message", msg);
    setMessages((m) => [
      ...m,
      {
        text: payload.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        me: true,
      },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("hc_token");
    if (socket) socket.disconnect();
    setUser(null);
    setPage("landing");
  };

  return (
    <div style={{ background: "#FFF8FB", minHeight: "100vh" }}>
      <Nav
        onNavigate={setPage}
        coins={coins}
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onLogout={handleLogout}
        user={user}
      />
      <main>
        {page === "landing" && <Landing onStart={() => setPage("match")} />}
        {page === "match" && (
          <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>Explore (demo)</div>
        )}
        {page === "chat" && <ChatPage messages={messages} onSend={handleSend} />}
        {page === "wallet" && (
          <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>Wallet (demo)</div>
        )}
      </main>
    </div>
  );
}
