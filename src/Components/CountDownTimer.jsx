import React from 'react';
import {useState} from 'react'
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../hooks/useCountDown';
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

const ShowCounter = ({ minutes, seconds }) => {

  const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  const [userName, setUserName] = useState(sessionStorage.getItem("username"));


  const setChar = async (charName) => {
    await updateDoc(doc(db, "rooms", inputRoom,inputRoom,userName), { selectedChar : charName });
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
        <CharList setChar={setChar}/>
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [minutes, seconds] = useCountdown(targetDate);

  if (minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
