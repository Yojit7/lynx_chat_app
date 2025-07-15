import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router';
import { sendMessage, getMessagesForChatRoom, editMessage, deleteMessage } from './chat_screen_api';

const ChatScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [editError, setEditError] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        // Get data from navigation state
        const receivedData = location.state;

        if (receivedData) {
            setChatData(receivedData);
            console.log('Received chat data:', receivedData);

            // Load existing messages
            loadMessages(receivedData.senderId, receivedData.receiverId);

            // Set up interval to load messages every 2 seconds
            intervalRef.current = setInterval(() => {
                loadMessages(receivedData.senderId, receivedData.receiverId);
            }, 2000);
        } else {
            console.error('No chat data received');
            navigate('/UserListScreen');
        }

        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
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

    const handleLongPress = (msg) => {
        // Only allow editing/deleting own messages
        if (msg.senderId === chatData.senderId) {
            // Show options dialog or directly show edit/delete buttons
            setEditingMessageId(msg.id);
            setEditingText(msg.message);
            setEditError('');
            setDeleteError('');
        }
    };

    const handleShowDeleteDialog = (msg) => {
        setMessageToDelete(msg);
        setShowDeleteDialog(true);
        setEditingMessageId(null); // Close edit mode if open
    };

    const handleDeleteMessage = async () => {
        if (messageToDelete) {
            try {
                await deleteMessage(
                    chatData.senderId,
                    chatData.receiverId,
                    messageToDelete.id,
                    messageToDelete
                );

                // Update local state
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === messageToDelete.id
                            ? { ...msg, isDeleted: true }
                            : msg
                    )
                );

                setShowDeleteDialog(false);
                setMessageToDelete(null);
                setDeleteError('');
            } catch (error) {
                console.error('Error deleting message:', error);
                setDeleteError('Failed to delete message. Please try again.');
                setShowDeleteDialog(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setMessageToDelete(null);
        setDeleteError('');
    };

    const handleEditMessage = async () => {
        if (editingText.trim() && editingMessageId) {
            try {
                // Find the original message data
                const originalMessage = messages.find(msg => msg.id === editingMessageId);

                await editMessage(
                    chatData.senderId,
                    chatData.receiverId,
                    editingMessageId,
                    editingText.trim(),
                    originalMessage
                );

                // Update local state
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === editingMessageId
                            ? { ...msg, message: editingText.trim(), isEdited: true }
                            : msg
                    )
                );

                setEditingMessageId(null);
                setEditingText('');
                setEditError('');
            } catch (error) {
                console.error('Error editing message:', error);
                setEditError('Failed to edit message. Please try again.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingText('');
        setEditError('');
    };

    const handleEditInput = (e) => {
        setEditingText(e.detail.value);
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

            {/* Edit Error Message */}
            {editError && (
                <view style={{
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    margin: '10px',
                    borderRadius: '8px',
                    border: '1px solid #f44336'
                }}>
                    <text style={{
                        color: '#f44336',
                        fontSize: '14px'
                    }}>
                        {editError}
                    </text>
                </view>
            )}

            {/* Delete Error Message */}
            {deleteError && (
                <view style={{
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    margin: '10px',
                    borderRadius: '8px',
                    border: '1px solid #f44336'
                }}>
                    <text style={{
                        color: '#f44336',
                        fontSize: '14px'
                    }}>
                        {deleteError}
                    </text>
                </view>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <view style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <view style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '300px',
                        width: '90%'
                    }}>
                        <text style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            Delete Message
                        </text>
                        <text style={{
                            fontSize: '14px',
                            marginBottom: '20px',
                            color: '#666'
                        }}>
                            Are you sure you want to delete this message? This action cannot be undone.
                        </text>
                        <view style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            justifyContent: 'flex-end'
                        }}>
                            <view
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                bindtap={handleCancelDelete}
                            >
                                <text style={{ fontSize: '14px' }}>Cancel</text>
                            </view>
                            <view
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                bindtap={handleDeleteMessage}
                            >
                                <text style={{ fontSize: '14px' }}>Delete</text>
                            </view>
                        </view>
                    </view>
                </view>
            )}

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
                        {msg.isDeleted ? (
                            // Deleted message display
                            <view style={{
                                padding: '10px 15px',
                                borderRadius: '15px',
                                maxWidth: '60%',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                opacity: 0.6
                            }}>
                                <text style={{
                                    fontSize: '14px',
                                    fontStyle: 'italic',
                                    color: '#6c757d'
                                }}>
                                    This message was deleted
                                </text>
                                <text style={{
                                    fontSize: '12px',
                                    opacity: 0.7,
                                    marginTop: '5px'
                                }}>
                                    {new Date(msg.timeStamp).toLocaleTimeString()}
                                </text>
                            </view>
                        ) : editingMessageId === msg.id ? (
                            // Editing mode
                            <view style={{
                                padding: '10px 15px',
                                borderRadius: '15px',
                                maxWidth: '60%',
                                backgroundColor: '#fff3cd',
                                border: '2px solid #ffc107'
                            }}>
                                <input
                                    id="edit-input"
                                    className="input-box"
                                    bindinput={handleEditInput}
                                    value={editingText}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        marginBottom: '10px'
                                    }}
                                />
                                <view style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '10px'
                                }}>
                                    <view
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        bindtap={handleEditMessage}
                                    >
                                        <text style={{ fontSize: '12px' }}>Save</text>
                                    </view>
                                    <view
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        bindtap={() => handleShowDeleteDialog(msg)}
                                    >
                                        <text style={{ fontSize: '12px' }}>Delete</text>
                                    </view>
                                    <view
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        bindtap={handleCancelEdit}
                                    >
                                        <text style={{ fontSize: '12px' }}>Cancel</text>
                                    </view>
                                </view>
                            </view>
                        ) : (
                            // Normal message display
                            <view
                                style={{
                                    padding: '10px 15px',
                                    borderRadius: '15px',
                                    maxWidth: '60%',
                                    backgroundColor: msg.senderId === chatData.senderId ? '#007bff' : '#e0e0e0',
                                    color: msg.senderId === chatData.senderId ? 'white' : 'black',
                                    cursor: msg.senderId === chatData.senderId ? 'pointer' : 'default'
                                }}
                                bindlongpress={() => handleLongPress(msg)}
                            >
                                <text>{msg.message}</text>
                                {msg.isEdited && (
                                    <text style={{
                                        fontSize: '11px',
                                        opacity: 0.6,
                                        fontStyle: 'italic'
                                    }}>
                                        (edited)
                                    </text>
                                )}
                                <text style={{
                                    fontSize: '12px',
                                    opacity: 0.7,
                                    marginTop: '5px'
                                }}>
                                    {new Date(msg.timeStamp).toLocaleTimeString()}
                                </text>
                            </view>
                        )}
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