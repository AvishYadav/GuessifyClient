import React, { useEffect } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.css";
import { io } from "socket.io-client";
import Test from "./pages/Test";
import {Routes, Route} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import GameRoom from "./pages/GameRoom";
import { ContextProvider } from "./Context";

// const socket = io("http://localhost:3001")

function App() {
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     //Reciveing messages from server
  //     socket.on("welcome", (data) => {
  //       console.log("msg from server", data);
  //     })

  //     //send a message to server
  //     socket.emit("msg", "Thanks for connecting")
  //   })

  //   return () => {
  //     // remove event listner
  //     socket.off("connect");
  //   };
  // }, []);

  return (
    // <ContextProvider></ContextProvider>
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="gameroom" element={<GameRoom/>}/>
          <Route path="test" element={<Test/>}/>
        </Routes>
      </header>
    </div>
  );
}

export default App;
