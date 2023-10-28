import React from 'react'
import { useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  query, 
  where,
} from "firebase/firestore";
import bcrypt from 'bcryptjs';




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userlistCollectionRef = collection(db, "users");
  
  
    const userLogin = async (e) => {
        e.preventDefault();
        if ( email!="" && password!=""){
          const q = query(userlistCollectionRef, where("email", "==", email));
          const qdocs = await getDocs(q);
          const userDoc = qdocs.docs[0];
          const userData = userDoc.data();
          const storedPass = userData.password;
          

          alert(storedPass);
          

          bcrypt.compare(password, storedPass, (err, result) => {
            if (err) {
              // Handle error
              console.log(err);
            }
            
            if (result) {
              // Passwords match
              console.log('Passwords match');
              alert('Passwords match');
            } else {
              // Passwords don't match
              console.log('Passwords dont match');
              alert('Passwords dont match');
            }
          });

        }
        else{
          alert("Please enter a valid username, email and password");
        }
        window.location.reload(false);
      };

        

  return (
    <div>
        <div className="form">  
          <form onSubmit={userLogin}>
            <input type="email" placeholder='Enter email' onChange={(event) => {setEmail(event.target.value);}}/>
            <input type="password" placeholder='Enter password' onChange={(event) => {setPassword(event.target.value);}}/>
            <button>Submit</button>
          </form>
        </div>
    </div>
  )
}

export default Login