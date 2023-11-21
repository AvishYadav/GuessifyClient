import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  doc,
  and,
  query,
  where,
} from "firebase/firestore";

const socket = io("http://localhost:3001");

const Home = () => {
  const [inputMsg, setInputMsg] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const [username, setUsername] = useState("");
  const [msgs, setMsgs] = useState([]);

  // function addMessage(message) {
  //     setMsgs((t) => [...t, message]);
  // }

  // function sendMsg(message, room) {
  //     if (message === "") return;
  //     addMessage(message);
  //     socket.emit("send-message", message, room);

  //     setInputMsg("");
  // }
  function submitUser(user) {}

  const collectionRef = collection(db, "rooms");

  const createRoom = async (e) => {
    if (username !== "" && inputRoom !== "") {
      console.log("true");
      await setDoc(doc(db, "rooms", inputRoom), { id: inputRoom });

      const roomRef = collection(db, "rooms", inputRoom, inputRoom);

      await addDoc(roomRef, {
        username: username,
      });
    } else {
      alert("Please enter a username and Room name properly");
    }
  };

  const joinRoom = async (e) => {
    // socket.emit("join-room", room, () => {
    // //   addMessage(`You connected to room: ${room}`);
    // });
    // sendData();
    const roomRef = collection(db, "rooms");
    const q = query(roomRef, where("id", "==", inputRoom));
    const qdocs = await getDocs(q);
    const roomDoc = qdocs.docs[0];
    console.log(roomDoc);
    const roomData = roomDoc.data();
    const roomid = roomData.id;

    if (username !== "" && inputRoom !== "" && roomid !== undefined && roomid !== null) {
      console.log(roomid);
      const roomRef = collection(db, "rooms", inputRoom, inputRoom);

      await addDoc(roomRef, {
        username: username,
      });
    } else {
      alert("Enter valid entries");
    }
    setInputRoom("");
  };

  return (
    <div>
      <h1>Home</h1>
      <input
        type="text"
        placeholder="Enter username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        type="text"
        placeholder="Room ID..."
        id="room-input"
        onChange={(e) => setInputRoom(e.target.value)}
      ></input>
      <button
        style={{ width: "70px", height: "30px" }}
        type="button"
        id="room-button"
        onClick={() => joinRoom(inputRoom, username)}
      >
        Join
      </button>
      <button
        style={{ width: "70px", height: "30px" }}
        type="button"
        id="room-button"
        onClick={() => createRoom()}
      >
        Create
      </button>

      {username}
    </div>
  );
};

export default Home;
