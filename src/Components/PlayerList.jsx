import React, { useEffect, useState, memo } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  doc,
  and,
  query,
  where,
} from "firebase/firestore";

const PlayerList = () => {
  const [inputRoom, setInputRoom] = useState("1234");
  const [playerList, setPlayerList] = useState([]);

  
  useEffect(() => {
    const getPlayerList = async (e) => {
      const roomRef = collection(db, "rooms", inputRoom, inputRoom);
      const q = query(roomRef);
      const qdocs = await getDocs(q);
      const plist = qdocs.docs.map(doc => doc.data());
      setPlayerList(plist);
    }
    getPlayerList()
        .catch(console.error);
  }, []);
  return (
    <div>
      {playerList.map((player, index) => (
        <p key={index}>{player.username}</p>
      ))}
    </div>
  )
}

export default memo(PlayerList);
