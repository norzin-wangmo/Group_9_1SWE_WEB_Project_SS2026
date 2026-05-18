"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useAuthStore from "@/store/authStore";
import { getInbox, getConversation, sendMessage } from "@/lib/api";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const [inbox, setInbox] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadInbox();

    // Support ?userId=X to open a conversation directly (e.g. from product page)
    const uid = searchParams.get("userId");
    const uname = searchParams.get("userName");
    if (uid) {
      setSelectedUserId(parseInt(uid));
      setSelectedUserName(uname || `User #${uid}`);
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId) loadConversation(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadInbox = async () => {
    setLoading(true);
    const data = await getInbox();
    if (data.conversations) setInbox(data.conversations);
    setLoading(false);
  };

  const loadConversation = async (userId) => {
    const data = await getConversation(userId);
    if (data.messages) setMessages(data.messages);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    setSending(true);
    const data = await sendMessage({ receiverId: selectedUserId, content: newMessage });
    if (data.message) {
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    }
    setSending(false);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Messages</h1>

        <div className="flex gap-4 rounded-2xl bg-white shadow-md overflow-hidden" style={{ height: "600px" }}>

          {/* Inbox sidebar */}
          <div className="w-64 shrink-0 border-r overflow-y-auto">
            <p className="p-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Conversations</p>
            {loading && <p className="px-4 text-sm text-slate-400">Loading...</p>}
            {inbox.map((conv) => {
              const other = conv.sender?.id === user?.id ? conv.receiver : conv.sender;
              return (
                <button
                  key={conv.id}
                  onClick={() => { setSelectedUserId(other.id); setSelectedUserName(other.name); }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 border-b ${selectedUserId === other.id ? "bg-blue-50" : ""}`}
                >
                  <p className="font-semibold text-slate-800 text-sm">{other.name}</p>
                  <p className="text-xs text-slate-400 truncate">{conv.content}</p>
                </button>
              );
            })}
          </div>

          {/* Conversation area */}
          <div className="flex flex-1 flex-col">
            {!selectedUserId ? (
              <div className="flex flex-1 items-center justify-center text-slate-400">
                Select a conversation
              </div>
            ) : (
              <>
                <div className="border-b px-6 py-4">
                  <p className="font-semibold text-slate-900">{selectedUserName}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${isMine ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-800"}`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="flex gap-3 border-t px-6 py-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border px-4 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}