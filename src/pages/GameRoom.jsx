import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket } from "../socket";
import MessageBox from "../Components/MessageBox";
import { db } from "../firebase-config";
import PlayerList from "../Components/PlayerList";
import CharList from "../Components/CharList";
import CountdownTimer from "../Components/CountDownTimer";
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
  const [inputMsg, setInputMsg] = useState("");
  const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  const TWO_MIN_IN_MS = 1 * 20 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterTwoMins = NOW_IN_MS + TWO_MIN_IN_MS;

  const [msgs, setMsgs] = useState([]);
  const [userName, setUserName] = useState(sessionStorage.getItem("username"));
  const [selectedChar, setSelectedChar] = useState();
  const [playerList, setPlayerList] = useState([]);
  const [roundNum, setRoundNum] = useState(1);
  const [selector, setSelector] = useState();
  const [playerNum, setPlayerNum] = useState();
  const [start, setStart] = useState(false);
  const [resetCount,setResetCount]=useState(0);

  const setChar = async (charName) => {
    await updateDoc(doc(db, "rooms", inputRoom, inputRoom, userName), {
      selectedChar: charName,
    });
    setSelectedChar(charName);
    currentSocket.emit("selected-char", charName, inputRoom);
    console.log("setSelectedChar");
  };

  const handleResetSelectedChar = () => {
    setSelectedChar();
    setResetCount(resetCount+1);
    if (playerNum > roundNum) {
      setSelector(playerList[roundNum].username);
      setRoundNum(roundNum + 1);
    } else {
      if (playerNum == roundNum) {
        setSelector(playerList[0].username);
        setRoundNum(1);
        setStart(!start);
      } else {
        console.log("Rotation error");
      }
    }

    console.log(`${selector} + new selector `);
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

  function toggleStart(room) {
    setStart(!start);
    currentSocket.emit("toggle-start", room);
  }

  useEffect(() => {
    const getPlayerList = async (e) => {
      const roomRef = collection(db, "rooms", inputRoom, inputRoom);
      const q = query(roomRef);
      const qdocs = await getDocs(q);
      const plist = qdocs.docs.map((doc) => doc.data());
      const pnumber = qdocs.size;
      console.log(pnumber);
      console.log(plist);
      console.log("playerlist");
      setPlayerList(plist);
      if (!selector) {
        setSelector(plist[0].username);
      }
      setPlayerNum(pnumber);
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
      socket.on("start-true", () => {
        setStart(true);
      });
    });
    window.addEventListener("beforeunload", delPlayer);
    window.addEventListener("hashchange", delPlayer);
    window.addEventListener("popstate", delPlayer);
    return () => {
      // remove event listner
      window.removeEventListener("beforeunload", delPlayer);
      window.removeEventListener("hashchange", delPlayer);
      window.removeEventListener("popstate", delPlayer);
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

  return (
    <>
      <h1>Game Room : {inputRoom}</h1>
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        <div
          className="player-list"
          style={{
            backgroundColor: "whitesmoke",
            color:"#FF7F50",
            borderRadius: "30px",
            padding: "1rem",
            margin: "1rem",
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
          {selectedChar ? (
            <div>
              <CountdownTimer
                targetDate={dateTimeAfterTwoMins}
                selector={selector}
                selectedChar={selectedChar}
                resetSelectedChar={handleResetSelectedChar}
              />
            </div>
          ) : (
            <div>Wait till selectioin of the character</div>
          )}
          {selector == userName && !selectedChar && (start || resetCount==playerNum) ? (
            <div>
              <CharList setChar={setChar} />
            </div>
          ) : selectedChar ? (
            <div>Character is selected</div>
          ) : (
            <div>Wait till selectioin of the character</div>
          )}
          {selector == userName && !start ? (
            <div>
              <button
                style={{ width: "70px", height: "30px" }}
                onClick={() => toggleStart(inputRoom)}
              >
                Start
              </button>
            </div>
          ) : (
            <>waiting for leader to start</>
          )}
        </div>
      </div>
    </>
  );
};

export default GameRoom;
