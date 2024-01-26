import React, { useEffect, useState } from "react";
import {useRef} from 'react';
import { io } from "socket.io-client";
import { socket } from "../socket";
import { useCountdown } from "../hooks/useCountDown";
import MessageBox from "../Components/MessageBox";
import { db } from "../firebase-config";
import PlayerList from "../Components/PlayerList";
import CharList from "../Components/CharList";
import DateTimeDisplay from "../Components/DateTimeDisplay";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  doc,
  and,
  query,
  where,
} from "firebase/firestore";


// const socket = io("http://localhost:3001");

const GameRoom = () => {
  const [currentSocket, setCurrentSocket] = useState(socket);
  const inputRef = useRef(null);
  const [inputMsg, setInputMsg] = useState("");
  const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  const TWO_MIN_IN_MS = 20 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterTwoMins = NOW_IN_MS + TWO_MIN_IN_MS;

  const [msgs, setMsgs] = useState([]);
  const [userName, setUserName] = useState(sessionStorage.getItem("username"));
  const [selectedChar, setSelectedChar] = useState();
  const [playerList, setPlayerList] = useState([]);
  const [roundNum, setRoundNum] = useState(1);
  const [selector, setSelector] = useState();
  
    
  const [minutes, seconds] = useCountdown(dateTimeAfterTwoMins);

  const setChar = async (charName) => {
    await updateDoc(doc(db, "rooms", inputRoom, inputRoom, userName), {
      selectedChar: charName,
    });
    
    setSelectedChar(charName);
    currentSocket.emit("selected-char", charName, inputRoom);
    console.log("setSelectedChar");
  };

  function addMessage(message) {
    setMsgs((t) => [...t, message]);
  }

  function sendMsg(message, room) {
    if (message === "") return;
    addMessage(message);
    currentSocket.emit("send-message", message, room);

    setInputMsg("");
  }

  function joinRoom(room) {
    socket.emit("join-room", room, () => {
      addMessage(`You connected to room: ${room}`);
    });
  }

  useEffect(() => {
    const getPlayerList = async (e) => {
      const roomRef = collection(db, "rooms", inputRoom, inputRoom);
      const q = query(roomRef);
      const qdocs = await getDocs(q);
      const plist = qdocs.docs.map((doc) => doc.data());
      console.log(plist);
      console.log("playerlist");
      setPlayerList(plist);
      setSelector(plist[0].username);
    };
    socket.connect();
    setCurrentSocket(socket);
    if (inputRoom !== "" && inputRoom !== null) {
      joinRoom(inputRoom);
      getPlayerList().catch(console.error);
    }
    socket.on("connect", () => {
      //Reciveing messages from server
      addMessage(`You connected with id: ${socket.id}`);

      socket.on("recieve-message", (message) => {
        addMessage(message);
      });
      socket.on("char-select", (selectedChar) => {
        setSelectedChar(selectedChar);
        console.log("here");
      });
      socket.on("player-joined", (message) => {
        getPlayerList().catch(console.error);
      });
    });
    window.addEventListener("beforeunload", delPlayer);
    window.addEventListener("hashchange", delPlayer);
    window.addEventListener("popstate", delPlayer);
    // window.addEventListener('unload', handleEndConcert)
    return () => {
      // remove event listner
      window.removeEventListener("beforeunload", delPlayer);
      window.removeEventListener("hashchange", delPlayer);
      window.removeEventListener("popstate", delPlayer);
      // window.removeEventListener('unload', handleEndConcert)
      // handleEndConcert()
      console.log("Component is unmounting");

      socket.off("connect");
    };
  }, []);

  const delPlayer = async (e) => {
    // sessionStorage.clear();
    const playerRef = doc(db, "rooms", inputRoom, inputRoom, userName);
    const q = query(playerRef);
    await deleteDoc(q);
  };

  const ExpiredNotice = () => {
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

  return (
    <>
      <h1>Game Room : {inputRoom}</h1>
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        <div
          className="player-list"
          style={{
            backgroundColor: "#b3b3b3",
            borderRadius: "30px",
            padding: "1rem",
            margin: "1rem",
            flex: "20%",
          }}
        >
          <PlayerList playerList={playerList} />
        </div>
        <div
          className="chat-box"
          style={{
            backgroundColor: "#28283c",
            borderRadius: "30px",
            padding: "1rem",
            margin: "1rem",
            flex: "20%",
          }}
        >
          <MessageBox msgs={msgs} />
          <input
            ref={inputRef}
            type="text"
            placeholder="say something"
            id="message-input"
          ></input>
          <button
            style={{ width: "70px", height: "30px" }}
            type="button"
            id="message-button"
            onClick={() => sendMsg(inputRef.current.value, inputRoom)}
          >
            Send
          </button>
        </div>
        <div
          className="char-box"
          style={{
            backgroundColor: "#b3b3b3",
            borderRadius: "30px",
            padding: "1rem",
            margin: "1rem",
            flex: "20%",
          }}
        >
          {selector == userName && !selectedChar ? (
            <div>
              <CharList setChar={setChar} />
            </div>
          ) : selectedChar ? (
            <div>Character is selected</div>
          ) : (
            <div>Wait till selectioin of the character</div>
          )}

    {selectedChar ? (
            <div>
               {(minutes + seconds <= 0)? 
               (<div><ExpiredNotice /></div>) :(<div><ShowCounter minutes={minutes} seconds={seconds} selector={selector} /></div>) 
      }
            </div>
          ) : (
            <div>Wait till selectioin of the character</div>
          )}
        </div>
      </div>
    </>
  );
};

export default GameRoom;
