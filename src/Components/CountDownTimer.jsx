import React from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { socket } from "../socket";
import DateTimeDisplay from "./DateTimeDisplay";
import { useCountdown } from "../hooks/useCountDown";
import MessageBox from "../Components/MessageBox";
import CharList from "../Components/CharList";
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
  FieldValue,
  increment,
} from "firebase/firestore";
import { db } from "../firebase-config";

const ExpiredNotice = (selectedChar) => {
  const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  const [userName, setUserName] = useState(sessionStorage.getItem("username"));
  const [flag, setFlag] = useState(false);

  const setScore = async () => {
    await updateDoc(doc(db, "rooms", inputRoom, inputRoom, userName), {
      score: increment(50),
    });
  };
  console.log(sessionStorage.getItem("guessed"));
  console.log(flag);
  if (selectedChar.selectedChar === sessionStorage.getItem("guessed") && !flag) {
    setScore();
    console.log("score updated successfully");
    setFlag(true);
  }
  return (
    <div className="expired-notice">
      <span>Expired!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};

const ShowCounter = ({ minutes, seconds, selector }) => {
  const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  const [userName, setUserName] = useState(sessionStorage.getItem("username"));

  const [guessedChar, setGuessedChar] = useState();

  const setGuess = async (charName) => {
    await updateDoc(doc(db, "rooms", inputRoom, inputRoom, userName), {
      guessChar: charName,
    });
    setGuessedChar(charName);
    sessionStorage.setItem("guessed", charName);
    // socket.emit("selected-char",charName,inputRoom);
  };

  return (
    <div className="show-counter">
      <a
        href="https://tapasadhikary.com"
        target="_blank"
        rel="noopener noreferrer"
        className="countdown-link"
      >
        <DateTimeDisplay
          value={minutes}
          type={"Mins"}
          isDanger={seconds <= 10 && minutes == 0}
        />
        <p>:</p>
        <DateTimeDisplay
          value={seconds}
          type={"Seconds"}
          isDanger={seconds <= 10 && minutes == 0}
        />
      </a>
      <br />
      <div>
        {selector != userName ? (
          <div>
            <CharList setChar={setGuess} />
          </div>
        ) : (
          <div>you are selector</div>
        )}
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate, selector, selectedChar }) => {
  const [minutes, seconds] = useCountdown(targetDate);

  if (minutes + seconds > 0) {
    return (
      <ShowCounter minutes={minutes} seconds={seconds} selector={selector} />
    );
    
  } 
  else if (minutes + seconds == 0) {
    return <ExpiredNotice selectedChar={selectedChar} />;
  }
  else {
    return (
      <>scorecard</>
    );
  }
};

export default CountdownTimer;
