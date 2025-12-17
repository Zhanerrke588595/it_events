import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/apiService"
import { API_ENDPOINTS } from "../../config/api"

// Async thunks
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get(API_ENDPOINTS.events)
    return data
  } catch (error) {
    return rejectWithValue("Failed to fetch events")
  }
})

export const fetchEventById = createAsyncThunk("events/fetchEventById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`${API_ENDPOINTS.events}/${id}`)
    return data
  } catch (error) {
    return rejectWithValue("Failed to fetch event")
  }
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState()
    const newEvent = {
      ...eventData,
      creatorId: auth.user.id,
      creatorName: auth.user.name,
      status: auth.user.role === "admin" || auth.user.isVerified ? "approved" : "pending",
      createdAt: new Date().toISOString(),
      attendees: [],
    }

    const { data } = await api.post(API_ENDPOINTS.events, newEvent)
    return data
  } catch (error) {
    return rejectWithValue("Failed to create event")
  }
})

export const updateEvent = createAsyncThunk("events/updateEvent", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`${API_ENDPOINTS.events}/${id}`, updates)
    return data
  } catch (error) {
    return rejectWithValue("Failed to update event")
  }
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`${API_ENDPOINTS.events}/${id}`)
    return id
  } catch (error) {
    return rejectWithValue("Failed to delete event")
  }
})

export const bookEvent = createAsyncThunk("events/bookEvent", async ({ eventId, userId }, { rejectWithValue }) => {
  try {
    // Get current event
    const { data: event } = await api.get(`${API_ENDPOINTS.events}/${eventId}`)

    // Check if already booked
    if (event.attendees?.includes(userId)) {
      return rejectWithValue("Already registered for this event")
    }

    // Update attendees
    const updatedAttendees = [...(event.attendees || []), userId]
    const { data } = await api.patch(`${API_ENDPOINTS.events}/${eventId}`, {
      attendees: updatedAttendees,
    })

    // Debug: log updated event returned by server
    console.log("bookEvent: updated event", data)

    return data
  } catch (error) {
    return rejectWithValue("Failed to book event")
  }
})

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    currentEvent: null,
    loading: false,
    error: null,
    filters: {
      search: "",
      type: "all",
      status: "approved",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Event By ID
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload
      })
      // Create Event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload)
      })
      // Update Event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload
        }
      })
      // Delete Event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload)
      })
      // Book Event
      .addCase(bookEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
            if (state.currentEvent?.id === action.payload.id) {
        state.currentEvent = {
          ...state.currentEvent,   // ← сохраняем img, title, всё
          ...action.payload,       // ← обновляем attendees
        }
      }

      })
  },
})

export const { setFilters, clearCurrentEvent } = eventsSlice.actions
export default eventsSlice.reducer
