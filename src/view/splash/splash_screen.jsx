import { useEffect } from '@lynx-js/react'
import { useNavigate } from 'react-router'
import { analytics } from '../../service/firebase/firebase_service'

const SplashScreen = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Log analytics event for splash screen view


        // Navigate to login screen after 2 seconds
        const timer = setTimeout(() => {
            navigate('/LoginScreen')
        }, 2000)

        // Cleanup timer if component unmounts
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <view style={{
            backgroundColor: 'white',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <text style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                marginBottom: '20px'
            }}>
                Welcome to Lynx Chat
            </text>
            <text style={{
                fontSize: '16px',
                color: '#666',
                textAlign: 'center'
            }}>
                Loading...
            </text>
        </view>
    )
}

export default SplashScreen