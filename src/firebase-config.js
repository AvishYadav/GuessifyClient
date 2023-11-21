import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDvZxCAaecgKHWSCoGwrnTKTI8H08uq1V0",
  authDomain: "sockettest-7dc33.firebaseapp.com",
  projectId: "sockettest-7dc33",
  storageBucket: "sockettest-7dc33.appspot.com",
  messagingSenderId: "545103748133",
  appId: "1:545103748133:web:8daef7e8f88253311b73cc",
  measurementId: "G-ZZNT4X1MDC"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);