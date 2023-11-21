import React from 'react'
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  and,
} from "firebase/firestore";
import bcrypt from 'bcryptjs';


const Signup = () => {
    
  const [newUsername, setNewusername] = useState("");
  const [newEmail, setNewemail] = useState("");
  const [newPassword, setNewpassword] = useState("");
  
  const [userlist, setUserlist] = useState([]);
  const userlistCollectionRef = collection(db, "users");

    const createUser = async (e) => {
        e.preventDefault();
        if (newUsername!=="" && newEmail!=="" && newPassword!==""){
          const saltRounds = 10; // Number of salt rounds for hashing
          const password = newPassword
          
          const hashedPassword = bcrypt.hashSync(password,saltRounds);
          console.log(hashedPassword);
        
          await addDoc(userlistCollectionRef, { username: newUsername, email: newEmail, password: hashedPassword });
        }
        else{
          alert("Please enter a valid username, email and password");
        }
        window.location.reload(false);
      };

      useEffect(() => {
        const getUserlist = async () => {
          const data = await getDocs(userlistCollectionRef);
          setUserlist(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
    
        getUserlist();
      }, []);

        

  return (
    <div>
        <div className="form">  
          <form onSubmit={createUser}>
            <input type="text" placeholder='Enter username' onChange={(event) => {setNewusername(event.target.value);}}/>
            <input type="email" placeholder='Enter email' onChange={(event) => {setNewemail(event.target.value);}}/>
            <input type="password" placeholder='Enter password' onChange={(event) => {setNewpassword(event.target.value);}}/>
            <button>Submit</button>
          </form>
        </div>
        <div>
        {userlist.map((user)=>{
            return(
                <div className="flex justify-between">
                    {" "}
                    <div>
                        <p>{user.username}</p>
                        <p>{user.password}</p>
                        <p>{user.email}</p>
                    </div>
                </div>
            )
        })}
        </div>
    </div>
  )
}

export default Signup