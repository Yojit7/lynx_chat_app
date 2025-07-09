import { auth, db } from '../../service/firebase/firebase_service';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';



// export const doCreateUserWithEmailAndPassword = async (email, userName, password) => {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         return userCredential;
//     } catch (error) {
//         console.error("Error creating user:", error);
//         throw error;
//     }
// }

export const doCreateUserWithEmailAndPassword = async (email, userName, password) => {
    try {
        // Check if user already exists in Firestore by email
        const emailQuery = query(collection(db, 'users'), where('email', '==', email));
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
            throw new Error('User with this email already exists');
        }

        // Check if username already exists
        const usernameQuery = query(collection(db, 'users'), where('userName', '==', userName));
        const usernameSnapshot = await getDocs(usernameQuery);

        if (!usernameSnapshot.empty) {
            throw new Error('Username already exists');
        }

        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: email,
            userName: userName,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });

        console.log("User created and data stored in Firestore");
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