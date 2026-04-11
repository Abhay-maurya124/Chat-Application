import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const FetchContext = createContext();

export const FetchDataProvider = ({ children }) => {
  const [profiledata, setProfiledata] = useState(null);
  const [AllChat, setAllChat] = useState({ chats: [] });
  const [Getmessages, setGetmessages] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const activeChatIdRef = useRef(null);

  // Helper to get base URLs from env
  const userURL = import.meta.env.VITE_USER_SERVICE_URL;
  const chatURL = import.meta.env.VITE_CHAT_SERVICE_URL;

  const getConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }), []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${userURL}/v1/user/profile`, getConfig());
      setProfiledata(res.data);
      return res.data;
    } catch (e) {
      console.error("Profile Error:", e.message);
      return null;
    }
  }, [getConfig, userURL]);

  const getUserAllChats = useCallback(async () => {
    try {
      const res = await axios.get(`${chatURL}/v2/chat/all`, getConfig());
      const data = res.data;

      if (activeChatIdRef.current && data?.chats) {
        data.chats = data.chats.map(item =>
          item.chat._id === activeChatIdRef.current
            ? { ...item, chat: { ...item.chat, unSeencount: 0 } }
            : item
        );
      }
      setAllChat(data);
    } catch (e) {
      console.error("AllChats Error:", e.message);
    }
  }, [getConfig, chatURL]);

  const fetchGlobalUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${userURL}/v1/user/alluser`, getConfig());
      setAllUsers(res.data);
    } catch (e) {
      console.error("Global Users Error:", e.message);
    }
  }, [getConfig, userURL]);

  const getUserChats = useCallback(async (chatId) => {
    try {
      const res = await axios.get(`${chatURL}/v2/message/${chatId}`, getConfig());
      activeChatIdRef.current = chatId;
      setGetmessages({
        activeChatId: chatId,
        messages: res.data.messages,
        user: res.data.user,
      });
      setAllChat(prev => {
        if (!prev?.chats) return prev;
        return {
          ...prev,
          chats: prev.chats.map(item =>
            item.chat._id === chatId ? { ...item, chat: { ...item.chat, unSeencount: 0 } } : item
          )
        };
      });
    } catch (e) {
      console.error("GetMessages Error:", e.message);
    }
  }, [getConfig, chatURL]);

  const createChat = useCallback(async (otherUserId) => {
    try {
      const res = await axios.post(`${chatURL}/v2/newChat`, { otherUserId }, getConfig());
      await getUserAllChats();
      if (res.data.chatId) getUserChats(res.data.chatId);
    } catch (e) {
      console.error("Create Chat Error:", e.message);
    }
  }, [getConfig, chatURL, getUserAllChats, getUserChats]);

  const NewMessage = useCallback(async (chatId, text) => {
    try {
      const res = await axios.post(`${chatURL}/v2/message`, { chatId, text }, getConfig());
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
  }, [getConfig, chatURL, getUserAllChats]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchProfile().then(userData => {
      if (userData) {
        getUserAllChats();
        fetchGlobalUsers();
      }
    });
  }, [fetchProfile, getUserAllChats, fetchGlobalUsers]);

  return (
    <FetchContext.Provider value={{
      profiledata, setProfiledata, fetchProfile, AllChat, setAllChat,
      getUserAllChats, Getmessages, setGetmessages, getUserChats,
      NewMessage, allUsers, createChat, fetchGlobalUsers, activeChatIdRef
    }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetchData = () => useContext(FetchContext);