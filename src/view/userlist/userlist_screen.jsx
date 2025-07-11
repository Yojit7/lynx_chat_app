import { useState, useEffect } from "@lynx-js/react";
import { useNavigate } from 'react-router';
import "../../App.css";
import { getUserListFromFirestore, getCurrentUserData } from '../../service/api_services/firebase_api'
import { getCurrentUser } from '../../service/firebase/auth';

const UserListScreen = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [AuthUser, setAuthUser] = useState("");
    const [currentUserData, setCurrentUserData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
        fetchCurrentUserData()
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Call your actual API
            const response = await getUserListFromFirestore(); // Replace 'users' with your collection name
            console.log('API Response:', response); // Log to console

            setUsers(response); // Use API data or fallback to demo
        } catch (error) {
            console.error("Error fetching users:", error);

        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (receiverId, receiverName) => {
        const chatData = {
            senderId: currentUserData.id,
            receiverId: receiverId,
            receiverName: receiverName,
        };

        navigate('/ChatScreen', {
            state: chatData
        });
    };

    const handleBackToLogin = () => {
        navigate('/LoginScreen');
    };

    const fetchCurrentUser = () => {
        const user = getCurrentUser();
        setAuthUser(user);
        console.log('Current User:', user); // Debug log
    }

    const fetchCurrentUserData = async () => {
        try {
            const userData = await getCurrentUserData();
            setCurrentUserData(userData);
            console.log('Current User Data:', userData); // Debug log
        } catch (error) {
            console.error('Error fetching current user data:', error);
        }
    }


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
                <view style={{
                    height: '70px',
                    flexDirection: 'row',
                }}>
                    <text style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#333333'
                    }}>Select User to Chat</text>

                    <text style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333333'
                    }}>{AuthUser}</text>
                    <text style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333333'
                    }}>{currentUserData.id || "null"}</text>
                </view>

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
                                bindtap={() => {
                                    handleUserSelect(user.id, user.userName);
                                }}
                                exposure-id={`user-item-${user.id}`}
                            >
                                <view style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>

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
                                            {user.email.charAt(0).toUpperCase()}
                                        </text>
                                    </view>


                                    <view style={{
                                        flex: 1
                                    }}>
                                        <text style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#333333',
                                            marginBottom: '4px'
                                        }}>
                                            {user.userName || 'Unknown User'}
                                        </text>
                                        <text style={{
                                            fontSize: '14px',
                                            color: '#666666'
                                        }}>
                                            {user.email}
                                        </text>

                                        <text style={{
                                            fontSize: '14px',
                                            color: '#666666'
                                        }}>
                                            ID: {user.id}
                                        </text>


                                    </view>
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

        </view >
    );
};

export default UserListScreen;