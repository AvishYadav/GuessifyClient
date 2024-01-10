import React, { useContext, useState } from "react";

const RoomContext = React.createContext();
const RoomUpdateContext = React.createContext();

export function useRoom() {
    return useContext(RoomContext)
}

export function useRoomUpdate(room) {
    return useContext(RoomUpdateContext(room))
}

export function ContextProvider({ children }) {
    const [room, setRoom] = useState("");

    function roomUpdate(room) {
        setRoom(room);
    }

    return (
        <RoomContext.Provider value={room}>
            <ContextProvider.Provider value={roomUpdate}>
                {children}
            </ContextProvider.Provider>
        </RoomContext.Provider>
    )
}