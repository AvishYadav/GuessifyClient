const initialState = "";

const changeRoom = (state = initialState, action) => {
    switch (action.type) {
        case "SETROOM": return state += action.payLoad;
        default: return state;
    }
}

export default changeRoom;