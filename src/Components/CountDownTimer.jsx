import React from 'react';
import {useState} from 'react'
import { io } from "socket.io-client";
import { socket } from '../socket';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../hooks/useCountDown';
import MessageBox from "../Components/MessageBox";
import  CharList  from "../Components/CharList";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  and,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";


const ExpiredNotice = () => {

  return (
    <div className="expired-notice">
      <span>Expired!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};

const ShowCounter = ({ minutes, seconds,selector }) => {

  const [msgs, setMsgs] = useState([]);
  const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  const [inputMsg, setInputMsg] = useState("");
  const [userName, setUserName] = useState(sessionStorage.getItem("username"));
  const [guessedChar, setGuessedChar] = useState();

  const setGuess = async (charName) => {
    await updateDoc(doc(db, "rooms", inputRoom,inputRoom,userName), { guessChar : charName });
    setGuessedChar(charName);
    socket.emit("selected-char",charName,inputRoom);
  }
  function addMessage(message) {
    setMsgs((t) => [...t, message]);
  }

  function sendMsg(message, room) {
    if (message === "") return;
    addMessage(message);
    socket.emit("send-message", message, room);
    setInputMsg("");
  }

  

  return (
    <div className="show-counter">
      <a
        href="https://tapasadhikary.com"
        target="_blank"
        rel="noopener noreferrer"
        className="countdown-link"
      >
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={seconds<=10 && minutes==0} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={seconds<=10 && minutes==0} />
      </a>
      <br />
      <div>
        <MessageBox msgs={msgs} />
        <input
            type="text"
            placeholder="say something"
            id="message-input"
            onChange={(e) => setInputMsg(e.target.value)}
          ></input>
          <button
            style={{ width: "70px", height: "30px" }}
            type="button"
            id="message-button"
            onClick={() => sendMsg(inputMsg, inputRoom)}
          >
            Send
          </button>
          {!selector?<div><CharList setChar={setGuess}/></div>:<div>you are selector</div>}
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate,selector }) => {
  const [minutes, seconds] = useCountdown(targetDate);

  if (minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        minutes={minutes}
        seconds={seconds}
        selector={selector}
      />
    );
  }
};

export default CountdownTimer;
