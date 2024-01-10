import { createSlice } from '@reduxjs/toolkit'

export const roomValueSlice = createSlice({
    name: 'roomValue',
    initialState: {
      value: "",
    },
    reducers: {
      addRoomValue: (state, action) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes.
        // Also, no return statement is required from these functions.
        return state.value += action.payload
      },
      removeRoomValue: (state) => {
        state.value = ""
      },
    },
})

// Action creators are generated for each case reducer function
export const { addRoomValue, removeRoomValue } = roomValueSlice.actions

export default roomValueSlice.reducer

