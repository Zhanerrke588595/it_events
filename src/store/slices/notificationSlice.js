import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    type: "success", // 'success' | 'error' | 'info'
    show: false,
  },
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message
      state.type = action.payload.type || "success"
      state.show = true
    },
    hideNotification: (state) => {
      state.show = false
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer
