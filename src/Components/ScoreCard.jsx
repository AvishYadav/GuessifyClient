import React, { useEffect, useState, memo } from "react";

const ScoreCard = ({playerList}) => {
    console.log(playerList)
  return (
    <div>
      {playerList.map((player, index) => (
        <p key={index}>{player.username} {player.score}</p>
      ))}
    </div>
  )
}

export default memo(ScoreCard);
