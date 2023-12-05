import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
export const environment = {
     firebaseConfig : {
      apiKey: "AIzaSyAtGLMQbirAwrtNARCjH6nVB3Yhusn9T_E",
  authDomain: "substance-free.firebaseapp.com",
  projectId: "substance-free",
  storageBucket: "substance-free.appspot.com",
  messagingSenderId: "245848130365",
  appId: "1:245848130365:web:07b406e1e5cc529610bb54",
  measurementId: "G-FH3S4WS0GT"
      }
};
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
