import firebase from 'firebase/app';
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAw5NLN2xBkGLZh50Hd6oux22i2GfQ5oHY",
    authDomain: "aflfantasy-d89f3.firebaseapp.com",
    projectId: "aflfantasy-d89f3",
    storageBucket: "aflfantasy-d89f3.appspot.com",
    messagingSenderId: "662746667172",
    appId: "1:662746667172:web:0f672ac4c5b836d6b36e31"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;