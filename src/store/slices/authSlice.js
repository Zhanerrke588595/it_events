import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/apiService"
import { API_ENDPOINTS } from "../../config/api"

// Async thunks
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    // Check if user already exists
    const { data: existingUsers } = await api.get(`${API_ENDPOINTS.users}?email=${userData.email}`)

    if (existingUsers.length > 0) {
      return rejectWithValue("User with this email already exists")
    }

    // Create new user
    const newUser = {
      ...userData,
      role: userData.isCompany ? "company" : "user",
      isVerified: false,
      createdAt: new Date().toISOString(),
    }

    const { data } = await api.post(API_ENDPOINTS.users, newUser)

    // Generate token (in real app, this comes from backend)
    const token = `token_${data.id}_${Date.now()}`
    localStorage.setItem("authToken", token)
    localStorage.setItem("userId", data.id)

    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Registration failed")
  }
})

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data: users } = await api.get(`${API_ENDPOINTS.users}?email=${credentials.email}`)

    if (users.length === 0) {
      return rejectWithValue("User not found")
    }

    const user = users[0]

    if (user.password !== credentials.password) {
      return rejectWithValue("Invalid password")
    }

    // Generate token
    const token = `token_${user.id}_${Date.now()}`
    localStorage.setItem("authToken", token)
    localStorage.setItem("userId", user.id)

    return user
  } catch (error) {
    return rejectWithValue(error.response?.data || "Login failed")
  }
})

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      return rejectWithValue("No auth token")
    }

    const { data } = await api.get(`${API_ENDPOINTS.users}/${userId}`)
    return data
  } catch (error) {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    return rejectWithValue("Authentication failed")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem("authToken")
      localStorage.removeItem("userId")
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
