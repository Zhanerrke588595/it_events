"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { register, clearError } from "../store/slices/authSlice"
import { showNotification } from "../store/slices/notificationSlice"

function RegisterPage() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isCompany: false,
    companyName: "",
  })

  useEffect(() => {
    if (error) {
      dispatch(showNotification({ message: error, type: "error" }))
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      dispatch(showNotification({ message: "Please fill in all required fields", type: "error" }))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      dispatch(showNotification({ message: "Passwords do not match", type: "error" }))
      return
    }

    if (formData.password.length < 6) {
      dispatch(showNotification({ message: "Password must be at least 6 characters", type: "error" }))
      return
    }

    const result = await dispatch(register(formData))
    if (register.fulfilled.match(result)) {
      dispatch(showNotification({ message: "Registration successful!", type: "success" }))
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">IT Events</h1>
          <p className="text-text-secondary">Join Kazakhstan Tech Community</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="John Doe"
              />
            </div>

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
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Repeat password"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isCompany"
                checked={formData.isCompany}
                onChange={handleChange}
                className="w-4 h-4 text-secondary rounded focus:ring-secondary"
              />
              <label className="text-sm">I represent a company</label>
            </div>

            {formData.isCompany && (
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Company name"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-text-secondary mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
