import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import eventsReducer from "./slices/eventsSlice"
import notificationReducer from "./slices/notificationSlice"
import bookingsReducer from "./slices/bookingsSlice"  // <-- добавляем новый

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    notification: notificationReducer,
    bookings: bookingsReducer, // <-- добавляем сюда
  },
})
