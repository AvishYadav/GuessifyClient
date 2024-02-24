import React, { useEffect, useState, memo } from "react";
import "./PlayerList.scss";

// import { db } from "../firebase-config";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   deleteDoc,
//   setDoc,
//   doc,
//   and,
//   query,
//   where,
// } from "firebase/firestore";

const PlayerList = ({playerList}) => {
  // const [inputRoom, setInputRoom] = useState(sessionStorage.getItem("room"));
  // const [playerList, setPlayerList] = useState([]);

  
  // useEffect(() => {
  //   const getPlayerList = async (e) => {
  //     const roomRef = collection(db, "rooms", inputRoom, inputRoom);
  //     const q = query(roomRef);
  //     const qdocs = await getDocs(q);
  //     const plist = qdocs.docs.map(doc => doc.data());
  //     setPlayerList(plist);
  //   }
  //   getPlayerList()
  //       .catch(console.error);
  // }, []);
  console.log(playerList);
  return (
    <div className="list">
      <ul>
      {playerList.map((player, index) => (
        <li key={index} className="playerName">{player.username} {player.ready}</li>
      ))}

      </ul>
    </div>
  )
}

export default memo(PlayerList);
