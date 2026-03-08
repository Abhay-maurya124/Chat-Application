import React, { createContext, useContext, useState } from 'react'
const Chatcontext = createContext()
const NewContext = ({ children }) => {
    const [loading, setloading] = useState(false)
    return (
        <Chatcontext.Provider value={{ loading, setloading }}>
            {children}
        </Chatcontext.Provider>
    )
}

export default NewContext

export const useChatState = () => {
    const context = useContext(Chatcontext);
    if (!context) {
        throw new Error("useChatState must be used within a NewContext Provider");
    }
    return context;
};