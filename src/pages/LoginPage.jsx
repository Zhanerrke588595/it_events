"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { login, clearError } from "../store/slices/authSlice"
import { showNotification } from "../store/slices/notificationSlice"

function LoginPage() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (error) {
      dispatch(showNotification({ message: error, type: "error" }))
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      dispatch(showNotification({ message: "Please fill in all fields", type: "error" }))
      return
    }

    const result = await dispatch(login(formData))
    if (login.fulfilled.match(result)) {
      dispatch(showNotification({ message: "Login successful!", type: "success" }))
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">IT Events</h1>
          <p className="text-text-secondary">Kazakhstan Tech Community</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-text-secondary mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-secondary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
