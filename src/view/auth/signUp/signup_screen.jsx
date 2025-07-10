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

    const handleUserNameInput = (e) => {
        const currentValue = e.detail.value.trim();
        setPassword(currentValue);
    };

    const newUser = new User("jimmysuthar9999@gmail.com", "userName");

    async function handleLogin() {

        try {
            await doCreateUserWithEmailAndPassword("jimmysuthar9999@gmail.com", "Suthar@123")
                .then(async (user) => {
                    console.log("Login successful");
                    const userCredential = await addDocumentToFirestore('users', newUser.toFirestore());
                    setSuccess(userCredential.id + " Logged In Successfully");

                }).catch((error) => {
                    console.error("Login failed:", error)
                    setSuccess(error + " Error Occured");
                });
        } catch (error) {
            console.error("Login failed:", error);
            setSuccess("Login failed: " + error.message);
        }


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
            }}>SingUp Screen</text>

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
                        backgroundColor: '#007bff',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    bindtap={async () => {
                        setSuccess("Button Clicked");
                        handleLogin();


                    }}
                >
                    <text style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>SingUp</text>
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

            <text style={{
                marginTop: '20px',
                color: 'red',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>{success}</text>

        </view>
    );
}

export default SignUpScreen;