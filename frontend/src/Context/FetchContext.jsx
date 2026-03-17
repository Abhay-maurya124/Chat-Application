import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const FetchContext = createContext();

export const FetchDataProvider = ({ children }) => {
  const [profiledata, setProfiledata] = useState(null);
  const [AllChat, setAllChat] = useState({ chats: [] });
  const [Getmessages, setGetmessages] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Stable config using a getter so it always reads the latest token
  const getConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }), []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/v1/user/profile", getConfig());
      setProfiledata(res.data);
      return res.data;
    } catch (e) {
      console.error("Profile Error:", e.message);
      return null;
    }
  }, [getConfig]);

  const getUserAllChats = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5002/v2/chat/all", getConfig());
      setAllChat(res.data);
    } catch (e) {
      console.error("AllChats Error:", e.message);
    }
  }, [getConfig]);

  const fetchGlobalUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/v1/user/alluser", getConfig());
      setAllUsers(res.data);
    } catch (e) {
      console.error("Global Users Error:", e.message);
    }
  }, [getConfig]);

  const getUserChats = useCallback(async (chatId) => {
    try {
      const res = await axios.get(`http://localhost:5002/v2/message/${chatId}`, getConfig());
      setGetmessages({
        activeChatId: chatId,
        messages: res.data.messages,
        user: res.data.user,
      });
    } catch (e) {
      console.error("GetMessages Error:", e.message);
    }
  }, [getConfig]);

  const createChat = useCallback(async (otherUserId) => {
    try {
      const res = await axios.post("http://localhost:5002/v2/newChat", { otherUserId }, getConfig());
      await getUserAllChats();
      if (res.data.chatId) getUserChats(res.data.chatId);
    } catch (e) {
      console.error("Create Chat Error:", e.message);
    }
  }, [getConfig, getUserAllChats, getUserChats]);

  const NewMessage = useCallback(async (chatId, text) => {
    try {
      const res = await axios.post("http://localhost:5002/v2/message", { chatId, text }, getConfig());
      if (res.data.message) {
        setGetmessages(prev => ({
          ...prev,
          messages: [...(prev?.messages || []), res.data.message]
        }));
      }
      getUserAllChats();
    } catch (e) {
      console.error("Send Error:", e.message);
    }
  }, [getConfig, getUserAllChats]);

  // ✅ FIX: Run on mount — loads profile, chats, users without needing a page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchProfile().then(userData => {
      if (userData) {
        getUserAllChats();
        fetchGlobalUsers();
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FetchContext.Provider value={{
      profiledata,
      setProfiledata,       // ✅ exposed so login page can set it directly after verify
      fetchProfile,
      AllChat,
      setAllChat,           // ✅ FIX: was missing — Sidebar socket handler needs this
      getUserAllChats,
      Getmessages,
      setGetmessages,
      getUserChats,
      NewMessage,
      allUsers,
      createChat,
      fetchGlobalUsers,
    }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetchData = () => useContext(FetchContext);