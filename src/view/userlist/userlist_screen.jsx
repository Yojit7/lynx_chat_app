import { useState, useEffect } from "@lynx-js/react";
import { useNavigate } from 'react-router';
import "../../App.css";

const UserListScreen = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Demo users data
    const demoUsers = [
        {
            id: "1",
            displayName: "Alice Johnson",
            email: "alice.johnson@example.com",
            isOnline: true
        },
        {
            id: "2",
            displayName: "Bob Smith",
            email: "bob.smith@example.com",
            isOnline: false
        },
        {
            id: "3",
            displayName: "Charlie Brown",
            email: "charlie.brown@example.com",
            isOnline: true
        },
        {
            id: "4",
            displayName: "Diana Prince",
            email: "diana.prince@example.com",
            isOnline: true
        },
        {
            id: "5",
            displayName: "Edward Wilson",
            email: "edward.wilson@example.com",
            isOnline: false
        },
        {
            id: "6",
            displayName: "Fiona Davis",
            email: "fiona.davis@example.com",
            isOnline: true
        },
        {
            id: "7",
            displayName: "George Miller",
            email: "george.miller@example.com",
            isOnline: false
        },
        {
            id: "8",
            displayName: "Jimmy Suthar",
            email: "hannah.lee@example.com",
            isOnline: true
        },
            {
            id: "9",
            displayName: "Yojit Suthar",
            email: "hannah.lee@example.com",
            isOnline: true
        },
            {
            id: "10",
            displayName: "Sutradhar",
            email: "hannah.lee@example.com",
            isOnline: true
        }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUsers(demoUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (selectedUser) => {
        // Navigate to chat screen with selected user
        navigate('/ChatScreen', { 
            state: { 
                chatWith: selectedUser 
            }
        });
    };

    const handleBackToLogin = () => {
        navigate('/LoginScreen');
    };

    if (loading) {
        return (
            <view style={{
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <text style={{
                    fontSize: '18px',
                    color: '#666666'
                }}>Loading users...</text>
            </view>
        );
    }

    return (
        <view style={{
            backgroundColor: '#f5f5f5',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <view style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <text style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333333'
                }}>Select User to Chat</text>
                
                <text 
                    style={{
                        fontSize: '16px',
                        color: '#007AFF',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                    bindtap={handleBackToLogin}
                >
                    Back to Login
                </text>
            </view>

            {/* Scrollable Users List using scroll-view */}
            <scroll-view
                scroll-orientation="vertical"
                style={{
                    width: '100%',
                    height: 'calc(100% - 100px)',
                    backgroundColor: '#f5f5f5',
                    paddingTop: '20px',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }}
                id="userListContainer"
            >
                <view style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '20px'
                }}>
                    {users.length === 0 ? (
                        <view style={{
                            padding: '40px',
                            textAlign: 'center'
                        }}>
                            <text style={{
                                fontSize: '18px',
                                color: '#666666'
                            }}>
                                No users available to chat with.
                            </text>
                        </view>
                    ) : (
                        users.map((user, index) => (
                            <view
                                key={user.id}
                                style={{
                                    padding: '15px 20px',
                                    borderBottom: index < users.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                bindtap={() => handleUserSelect(user)}
                                exposure-id={`user-item-${user.id}`}
                            >
                                <view style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    {/* Avatar */}
                                    <view style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '25px',
                                        backgroundColor: '#007AFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '15px'
                                    }}>
                                        <text style={{
                                            color: '#ffffff',
                                            fontSize: '18px',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                        </text>
                                    </view>

                                    {/* User Info */}
                                    <view style={{
                                        flex: 1
                                    }}>
                                        <text style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#333333',
                                            marginBottom: '4px'
                                        }}>
                                            {user.displayName || 'Unknown User'}
                                        </text>
                                        <text style={{
                                            fontSize: '14px',
                                            color: '#666666'
                                        }}>
                                            {user.email}
                                        </text>
                                        {user.isOnline && (
                                            <text style={{
                                                fontSize: '12px',
                                                color: '#4CAF50',
                                                marginTop: '2px'
                                            }}>
                                                • Online
                                            </text>
                                        )}
                                    </view>

                                    {/* Arrow indicator */}
                                    <text style={{
                                        fontSize: '20px',
                                        color: '#cccccc'
                                    }}>
                                        →
                                    </text>
                                </view>
                            </view>
                        ))
                    )}
                </view>

                {/* Refresh Button */}
                <view style={{
                    textAlign: 'center',
                    paddingBottom: '30px'
                }}>
                    <text
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#007AFF',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            border: 'none'
                        }}
                        bindtap={fetchUsers}
                    >
                        Refresh User List
                    </text>
                </view>
            </scroll-view>
        </view>
    );
};

export default UserListScreen;