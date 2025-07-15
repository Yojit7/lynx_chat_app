import { useState } from "@lynx-js/react";
import { useNavigate } from 'react-router';
import "../../../App.css";
import { doCreateUserWithEmailAndPassword } from '../../../service/firebase/auth'
import { addDocumentToFirestore } from '../../../service/api_services/firebase_api'
import User from '../../../model/user_model';

const SignUpScreen = (props) => {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
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

    const handleUserNameInput = (e) => {
        const currentValue = e.detail.value.trim();
        setUserName(currentValue);
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSignUp = async () => {
        // Validate inputs
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!userName.trim()) {
            setError("Username is required");
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
            const newUser = new User(userName, email);
            const user = await doCreateUserWithEmailAndPassword(email, password);
            console.log("SignUp successful");
            const userCredential = await addDocumentToFirestore('users', newUser.toFirestore());
            setSuccess(userCredential.id + " Account Created Successfully");
            navigate('/UserListScreen');
        } catch (error) {
            console.error("SignUp failed:", error);
            setError("SignUp failed: " + error.message);
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
            }}>SignUp Screen</text>

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

                <view style={{ marginBottom: '20px' }}>
                    <text style={{
                        fontSize: '16px',
                        color: '#555555',
                        marginBottom: '8px',
                        display: 'block'
                    }}>UserName</text>
                    <input
                        id="input-id"
                        className="input-box"
                        bindinput={handleUserNameInput}
                        value={userName}
                        placeholder="Enter UserName"
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
                        backgroundColor: (!email.trim() || !userName.trim() || !password.trim() || loading) ? '#ccc' : '#007bff',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: (!email.trim() || !userName.trim() || !password.trim() || loading) ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s',
                        opacity: loading ? '0.7' : '1'
                    }}
                    bindtap={() => {
                        if (!loading && email.trim() && userName.trim() && password.trim()) {
                            handleSignUp();
                        }
                    }}
                >
                    <text style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        {loading ? 'Creating Account...' : 'SignUp'}
                    </text>
                </view>
            </view>
            <text bindtap={() => {
                navigate('/LoginScreen');
            }} style={{
                marginTop: '20px',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>Already have Account? Login</text>

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

export default SignUpScreen;