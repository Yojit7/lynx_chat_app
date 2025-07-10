import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';

const ChatScreen = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState('')

    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How are you?", sender: "receiver" },
        { id: 2, text: "I'm good, thanks! How about you?", sender: "sender" },
        { id: 3, text: "Doing great! What are you up to today?", sender: "receiver" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 3, text: "Doing great! What are you up to today?", sender: "receiver" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 3, text: "Doing great! What are you up to today?", sender: "receiver" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 3, text: "Doing great! What are you up to today?", sender: "receiver" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 3, text: "Doing great! What are you up to today?", sender: "receiver" },
        { id: 4, text: "Just working on some coding projects", sender: "sender" },
        { id: 3, text: "Doing great! What are you up to today?", sender: "receiver" },
    ])


    const handleMessageInput = (e) => {
        const currentValue = e.detail.value.trim();
        setMessage(currentValue);
    };

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, {
                id: Date.now(),
                text: message,
                sender: "sender"
            }])
            setMessage('')
        }
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

    return (
        <view style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f0f0f0'
        }}>
            {/* Header */}
            <view style={{
                padding: '15px',
                backgroundColor: '#007bff',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <text bindtap={() => {
                    navigate('/UserListScreen');
                }} style={{
                    fontSize: '35px',
                    color: '#cccccc',
                    flex: 1,

                    textAlign: 'left'
                }}>
                    ⬅
                </text>
                <text style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    flex: 2,
                    textAlign: 'center'
                }}>
                    Chat
                </text>
                <view style={{ flex: 1 }}></view>
            </view>

            {/* Messages Area */}
            <scroll-view
                scroll-orientation="vertical"
                style={{
                    flex: 1,
                    width: "100%",
                    height: "calc(100% - 120px)",
                    backgroundColor: '#f0f0f0',
                    padding: '20px'
                }}
                id="messages-container"
            >
                {messages.map((msg) => (
                    <view key={msg.id} style={{
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: msg.sender === 'sender' ? 'flex-end' : 'flex-start'
                    }}>
                        <view style={{
                            padding: '10px 15px',
                            borderRadius: '15px',
                            maxWidth: '60%',
                            backgroundColor: msg.sender === 'sender' ? '#007bff' : '#e0e0e0',
                            color: msg.sender === 'sender' ? 'white' : 'black'
                        }}>
                            <text>{msg.text}</text>
                        </view>
                    </view>
                ))}

            </scroll-view>

            {/* Input Area */}
            <view style={{
                padding: '15px',
                backgroundColor: 'white',
                borderTop: '1px solid #ddd',
                display: 'flex',
                marginBottom: '10px',
                flexDirection: 'row',
            }}>
                <input
                    id="input-id"
                    className="input-box"
                    bindinput={handleMessageInput}
                    value={message}
                    placeholder="Enter Message"
                />

                <view
                    style={{
                        width: '50%',
                        alignItems: 'center',
                        backgroundColor: 'green',
                        borderRadius: '4px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    bindtap={() => { }}
                >
                    <text style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>Send</text>
                </view>
            </view>
        </view>
    )
}

export default ChatScreen