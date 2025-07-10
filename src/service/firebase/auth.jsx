import { auth } from '../../service/firebase/firebase_service';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';



export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}


export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
}

export const doSignOut = async () => {
    try {
        await auth.signOut();
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}