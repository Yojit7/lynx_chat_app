import { root } from '@lynx-js/react';
import { App } from './App.jsx';
import LoginScreen from './view/auth/login/login_screen.jsx';
import SplashScreen from './view/splash/splash_screen.jsx';
import SignUpScreen from './view/auth/signUp/signup_screen.jsx';
import UserListScreen from './view/userlist/userlist_screen.jsx';
import ChatScreen from './view/chatScreen/chat_screen.jsx';
import { MemoryRouter, Routes, Route } from 'react-router';

// root.render(<App />)
root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/app" element={<App />} />
      <Route path="/LoginScreen" element={<LoginScreen />} />
      <Route path="/SignUpScreen" element={<SignUpScreen />} />
      <Route path="/UserListScreen" element={<UserListScreen />} />
      <Route path="/ChatScreen" element={<ChatScreen />} />
    </Routes>
  </MemoryRouter>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
