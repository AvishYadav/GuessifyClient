import React, {useEffect} from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import './App.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:3001")

function App() {

  useEffect(() => {
    socket.on("connect", () => {
      //Reciveing messages from server
      socket.on("welcome", (data) => {
        console.log("msg from server", data);
      })

      //send a message to server
      socket.emit("msg", "Thanks for connecting")
    })

    return () => {
      // remove event listner
      socket.off("connect");
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* <Signup /> */}
        <Login />
      </header>
    </div>
  );
}

export default App;
