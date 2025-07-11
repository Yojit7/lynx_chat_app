import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router';
import { sendMessage, getMessagesForChatRoom } from './chat_screen_api';

const ChatScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get data from navigation state
        const receivedData = location.state;

        if (receivedData) {
            setChatData(receivedData);
            console.log('Received chat data:', receivedData);

            // Load existing messages
            loadMessages(receivedData.senderId, receivedData.receiverId);
        } else {
            console.error('No chat data received');
            navigate('/UserListScreen');
        }
    }, [location.state, navigate]);

    const loadMessages = async (senderId, receiverId) => {
        try {
            const chatMessages = await getMessagesForChatRoom(senderId, receiverId);
            setMessages(chatMessages);
            console.log('Loaded messages:', chatMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() && chatData) {
            try {
                const messageData = {
                    receiverId: chatData.receiverId,
                    senderId: chatData.senderId,
                    message: message.trim(),

                };

                console.log('Sending message:', messageData);

                // Send message to Firestore
                const sentMessage = await sendMessage(messageData);

                // Update local state
                setMessages(prevMessages => [...prevMessages, sentMessage]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleMessageInput = (e) => {
        const currentValue = e.detail.value.trim();
        setMessage(currentValue);
    };

    if (loading) {
        return (
            <view style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0'
            }}>
                <text>Loading chat...</text>
            </view>
        );
    }

    if (!chatData) {
        return (
            <view style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0'
            }}>
                <text>No chat data available</text>
            </view>
        );
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
                    Chat with {chatData.receiverName}
                </text>
                <view style={{ flex: 1 }}></view>
            </view>

            {/* Chat Data Debug Info */}
            <view style={{
                padding: '10px',
                backgroundColor: '#ffffff',
                margin: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <text style={{
                    fontSize: '12px',
                    color: '#666666',
                    marginBottom: '5px'
                }}>
                    Sender: {chatData.senderName} ({chatData.senderId})
                </text>
                <text style={{
                    fontSize: '12px',
                    color: '#666666'
                }}>
                    Receiver: {chatData.receiverName} ({chatData.receiverId})
                </text>
            </view>

            {/* Messages Area */}
            <scroll-view
                scroll-orientation="vertical"
                style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: '#f0f0f0',
                    padding: '20px'
                }}
                id="messages-container"
            >
                {messages.map((msg, index) => (
                    <view key={msg.id || index} style={{
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: msg.senderId === chatData.senderId ? 'flex-end' : 'flex-start'
                    }}>
                        <view style={{
                            padding: '10px 15px',
                            borderRadius: '15px',
                            maxWidth: '60%',
                            backgroundColor: msg.senderId === chatData.senderId ? '#007bff' : '#e0e0e0',
                            color: msg.senderId === chatData.senderId ? 'white' : 'black'
                        }}>
                            <text>{msg.message}</text>
                            <text style={{
                                fontSize: '12px',
                                opacity: 0.7,
                                marginTop: '5px'
                            }}>
                                {new Date(msg.timeStamp).toLocaleTimeString()}
                            </text>
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
                    bindtap={handleSendMessage}
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
    );
};

export default ChatScreen;