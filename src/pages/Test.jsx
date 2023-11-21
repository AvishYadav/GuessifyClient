import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MessageBox from "../Components/MessageBox";

const socket = io("http://localhost:3001");

const Test = () => {
  const [inputMsg, setInputMsg] = useState("");
  const [inputRoom, setInputRoom] = useState("");
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


  function joinRoom(room){
    socket.emit("join-room", room, () => {
      addMessage(`You connected to room: ${room}`);
    });
  }

  useEffect(() => {
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
      <div
        id="chat-box"
        style={{
          background: "bisque",
          color: "royalblue",
          borderRadius: "10px",
          padding: "5px",
        }}
      >
        Test
        <MessageBox msgs={msgs}/>
      </div>
      <div id="form">
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
          onClick={() => joinRoom(inputRoom)}
        >
          Join
        </button>
      </div>
    </>
  );
};

export default Test;




// const form = document.getElementById("form");
// const chatBox = document.getElementById("chat-box");
// const messageInput = document.getElementById("message-input");
// const sendButton = document.getElementById("message-button");
// const roomInput = document.getElementById("room-input");
// const roomButton = document.getElementById("room-button");

// if (form) {
//   form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const message = messageInput.value;
//     const room = roomInput.value;
//     if (message === "") return;
//     displayMessage(message);
//     socket.emit("send-message", message, room);

//     messageInput.value = "";
//   });
// }

// if (roomButton) {
//   roomButton.addEventListener("click", () => {
//     const room = roomButton.value;
//     socket.emit("join-room", room, (message) => {
//       displayMessage(message);
//     });
//   });
// }





  

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     //Reciveing messages from server
  //     socket.on("welcome", (data) => {
  //       console.log("msg from server", data);
  //       displayMessage(data);
  //     })

  //     //send a message to server
  //     socket.emit("msg", "Thanks for connecting Home")
  //   })

  //   return () => {
  //     // remove event listner
  //     // socket.off("connect");
  //   };
  // }, []);