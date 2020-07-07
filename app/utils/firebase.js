import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAR8Vkdk70AC2UVqQG0lpqHw911T0Rqp_I",
    authDomain: "tenedores-e5909.firebaseapp.com",
    databaseURL: "https://tenedores-e5909.firebaseio.com",
    projectId: "tenedores-e5909",
    storageBucket: "tenedores-e5909.appspot.com",
    messagingSenderId: "692214626676",
    appId: "1:692214626676:web:afc1928c6fcd26eba45421"
}

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);