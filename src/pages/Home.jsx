import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import "./Home.scss";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  doc,
  and,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// import { useRoom, useRoomUpdate } from "../Context";
import { useSelector, useDispatch } from "react-redux";
// import { addRoomValue, removeRoomValue } from '../Components/RoomValueSlice'
// import { setRoom } from "../actions";

const Home = () => {
  // const [inputMsg, setInputMsg] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const [username, setUsername] = useState("");
  // const [msgs, setMsgs] = useState([]);
  const navigate = useNavigate();
  // const inputRoom = useRoom();
  // const roomUpdate = useRoomUpdate(Room);
  const roomValue = useSelector((state) => state.changeRoom);
  const dispatch = useDispatch();

  const createRoom = async (e) => {
    // roomUpdate(Room);
    if (username !== "" && inputRoom !== "") {
      console.log("true");
      const roomDocRef = await getDoc(query(doc(db, "rooms", inputRoom)));
      if (roomDocRef.exists()) {
        alert("exists");
        return;
      } else {
        alert("not found");
      }
      await setDoc(doc(db, "rooms", inputRoom), { id: inputRoom });

      const roomRef = collection(db, "rooms", inputRoom, inputRoom);

      // await addDoc(roomRef, {
      //   username: username,
      // });
      await setDoc(doc(roomRef, username), {
        username: username,
        ready: "Not Ready",
        score: 0,
      });
      sessionStorage.setItem("room", inputRoom);
      sessionStorage.setItem("username", username);
      navigate("/gameroom");
    } else {
      alert("Please enter a username and Room name properly");
    }
  };

  const joinRoom = async (e) => {
    const roomRef = collection(db, "rooms");
    const q = query(roomRef, where("id", "==", inputRoom));
    const qdocs = await getDocs(q);
    const roomDoc = qdocs.docs[0];
    const roomData = roomDoc.data();
    const roomid = roomData.id;

    if (
      username !== "" &&
      inputRoom !== "" &&
      roomid !== undefined &&
      roomid !== null
    ) {
      // dispatch(addRoomValue(inputRoom))
      dispatch({
        type: "SETROOM",
        payLoad: inputRoom,
      });
      console.log("redux" + roomValue);
      // console.log(roomid);
      const roomRef = collection(db, "rooms", inputRoom, inputRoom);

      const roomDocRef = await getDoc(
        query(doc(db, "rooms", inputRoom, inputRoom, username))
      );
      if (roomDocRef.exists()) {
        alert("exists");
        return;
      } else {
        alert("not found");
      }
      await setDoc(doc(roomRef, username), {
        username: username,
        ready: "Not Ready",
        score: 0,
      });
      sessionStorage.setItem("room", inputRoom);
      sessionStorage.setItem("username", username);
      navigate("/gameroom");
    } else {
      alert("Enter valid entries");
    }

    setInputRoom("");
  };

  return (
    <div className="form">
      <h1>Home</h1>
      <input
        type="text"
        placeholder="Enter username"
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      ></input>
      <input
        type="text"
        placeholder="Room ID..."
        id="room-input"
        onChange={(e) => setInputRoom(e.target.value)}
        className="input"
      ></input>
      <button
        type="button"
        id="room-button"
        onClick={() => joinRoom(inputRoom, username)}
        className="JoinBtn"
      >
        Join
      </button>
      <p>OR</p>
      <button
        type="button"
        id="room-button"
        onClick={() => createRoom()}
        className="CreateBtn"
      >
        Create
      </button>

      {username}
    </div>
  );
};

export default Home;
