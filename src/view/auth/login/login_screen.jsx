import { useState } from "@lynx-js/react";
import { useNavigate } from 'react-router';
import "../../../App.css";
import { doSignInWithEmailAndPassword } from '../../../service/firebase/auth'

const LoginScreen = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleEmailInput = (e) => {
        const currentValue = e.detail.value.trim();
        setEmail(currentValue);
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handlePasswordInput = (e) => {
        const currentValue = e.detail.value.trim();
        setPassword(currentValue);
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleLogin = async () => {
        // Validate inputs
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!password.trim()) {
            setError("Password is required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const user = await doSignInWithEmailAndPassword(email, password);
            console.log("Login successful");
            setSuccess(user.user.email + " Logged In Successfully");
            navigate('/UserListScreen');
        } catch (error) {
            console.error("Login failed:", error);
            setError("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <view style={{
            backgroundColor: '#ffffff',
            padding: '40px 20px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <text style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#333333',
                marginBottom: '40px',
                textAlign: 'center'
            }}>Login Screen</text>

            <view style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'offwhite',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <view style={{ marginBottom: '20px' }}>
                    <text style={{
                        fontSize: '16px',
                        color: '#555555',
                        marginBottom: '8px',
                        display: 'block'
                    }}>Email</text>
                    <input
                        id="input-id"
                        className="input-box"
                        bindinput={handleEmailInput}
                        value={email}
                        placeholder="Enter Email"
                    />
                </view>

                <view style={{ marginBottom: '30px' }}>
                    <text style={{
                        fontSize: '16px',
                        color: '#555555',
                        marginBottom: '8px',
                        display: 'block'
                    }}>Password</text>
                    <input
                        id="input-id"
                        className="input-box"
                        bindinput={handlePasswordInput}
                        value={password}
                        placeholder="Enter Password"
                    />
                </view>

                <view
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: (!email.trim() || !password.trim() || loading) ? '#ccc' : '#007bff',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: (!email.trim() || !password.trim() || loading) ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s',
                        opacity: loading ? '0.7' : '1'
                    }}
                    bindtap={() => {
                        if (!loading && email.trim() && password.trim()) {
                            handleLogin();
                        }
                    }}
                >
                    <text style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </text>
                </view>

            </view>
            <text bindtap={() => {
                navigate('/SignUpScreen');
            }} style={{
                marginTop: '20px',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>Don'y have Account? SignUp</text>
            
            {/* Error message */}
            {error && (
                <text style={{
                    marginTop: '15px',
                    color: '#ff0000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: '#ffebee',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ffcdd2'
                }}>{error}</text>
            )}
            
            {/* Success message */}
            {success && (
                <text style={{
                    marginTop: '15px',
                    color: '#4caf50',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: '#e8f5e8',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #c8e6c9'
                }}>{success}</text>
            )}
        </view>
    );
}

export default LoginScreen;