import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FetchContext = createContext();

export const FetchDataProvider = ({ children }) => {
  const [profiledata, setProfiledata] = useState(null);
  const [AllChat, setAllChat] = useState({ chats: [] });
  const [Getmessages, setGetmessages] = useState(null);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/v1/user/profile");
      setProfiledata(data);
      return data;
    } catch (e) { setProfiledata(null); }
  };

  const getUserAllChats = async () => {
    try {
      const { data } = await axios.get("/v1/chat/getall");
      setAllChat(data);
    } catch (e) { console.error(e); }
  };

  const getUserChats = async (chatId) => {
    try {
      const { data } = await axios.get(`/v1/chat/getmessages/${chatId}`);
      setGetmessages({
        activeChatId: chatId,
        messages: data.messages,
        user: data.user,
      });
      getUserAllChats();
    } catch (e) { console.error(e); }
  };

  const NewMessage = async (chatId, text, image) => {
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      if (text) formData.append("text", text);
      if (image) formData.append("image", image);

      const { data } = await axios.post("/v1/chat/send", formData);
      if (data.message) {
        setGetmessages((prev) => {
          if (!prev || prev.activeChatId !== chatId) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message],
          };
        });
      }
      
      getUserAllChats();
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  useEffect(() => {
    fetchProfile().then(user => { if (user) getUserAllChats(); });
  }, []);

  return (
    <FetchContext.Provider value={{ 
      profiledata, setProfiledata, fetchProfile, 
      AllChat, getUserAllChats, 
      Getmessages, setGetmessages, getUserChats, 
      NewMessage 
    }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetchData = () => useContext(FetchContext);