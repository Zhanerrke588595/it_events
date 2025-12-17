import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/apiService"
import { API_ENDPOINTS } from "../../config/api"

// Async thunk для добавления брони
export const addBooking = createAsyncThunk(
  "bookings/addBooking",
  async ({ userId, eventId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.bookings, { userId, eventId })
      return data
    } catch (error) {
      return rejectWithValue("Failed to add booking")
    }
  }
)

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { bookings: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload)
      })
  },
})

export default bookingsSlice.reducer
