// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsLSK7DYSXpqrNVTTaTB6WsUemXdbbpHk",
  authDomain: "calendone-c3d2e.firebaseapp.com",
  projectId: "calendone-c3d2e",
  storageBucket: "calendone-c3d2e.firebasestorage.app",
  messagingSenderId: "614127097265",
  appId: "1:614127097265:web:2ebba932f4f942887d5990"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};