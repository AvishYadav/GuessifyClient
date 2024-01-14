import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket } from '../socket';
import MessageBox from "../Components/MessageBox";
import PlayerList from "../Components/PlayerList";
import  CountdownTimer  from "../Components/CountDownTimer";

// const socket = io("http://localhost:3001");

const GameRoom = () => {
  const [inputMsg, setInputMsg] = useState("");
  const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  const TWO_MIN_IN_MS = 2 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterTwoMins = NOW_IN_MS + TWO_MIN_IN_MS;
  
  const [msgs, setMsgs] = useState([]);

  function addMessage(message) {
    setMsgs((t) => [...t, message]);
  }

  function sendMsg(message, room) {
    if (message === "") return;
    addMessage(message);
    socket.emit("send-message", message, room);

    setInputMsg("");
  }

  function joinRoom(room) {
    socket.emit("join-room", room, () => {
      addMessage(`You connected to room: ${room}`);
    });
  }

  useEffect(() => {
    // console.log("hi");
    socket.connect();
    if(inputRoom!==""){
      joinRoom(inputRoom);
    }
    socket.on("connect", () => {
      //Reciveing messages from server
      addMessage(`You connected with id: ${socket.id}`);

      socket.on("recieve-message", (message) => {
        addMessage(message);
      });
    });

    return () => {
      // remove event listner
      socket.off("connect");
    };
  }, []);

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
          <PlayerList />
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
          <CountdownTimer targetDate={dateTimeAfterTwoMins} />
        </div>
      </div>
    </>
  );
};

export default GameRoom;
