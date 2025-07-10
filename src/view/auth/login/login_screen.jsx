import { useState } from "@lynx-js/react";
import { useNavigate } from 'react-router';
import "../../../App.css";
import { doSignInWithEmailAndPassword } from '../../../service/firebase/auth'
const LoginScreen = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("Not Logged In");

    const navigate = useNavigate();
    const handleEmailInput = (e) => {
        const currentValue = e.detail.value.trim();
        setEmail(currentValue);
    };

    const handlePasswordInput = (e) => {
        const currentValue = e.detail.value.trim();
        setPassword(currentValue);
    };

    const handleLogin = async () => {

        navigate('/UserListScreen');

        // try {
        //     await doSignInWithEmailAndPassword(email, password)
        //         .then((user) => {
        //             console.log("Login successful");
        //             setSuccess(user.user.email + " Logged In Successfully");
        //             navigate('/UserListScreen');
        //         }).catch((error) => {
        //             console.error("Login failed:", error)
        //             setSuccess(error + " Logged In Successfully");
        //         });
        // } catch (error) {
        //     console.error("Login failed:", error);
        //     setSuccess("Login failed: " + error.message);
        // }

        // Add your login logic here
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
                        backgroundColor: '#007bff',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    bindtap={handleLogin}
                >
                    <text style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>Login</text>
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
            <text style={{
                marginTop: '20px',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>{success}</text>
        </view>
    );
}

export default LoginScreen;