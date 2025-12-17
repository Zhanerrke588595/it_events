"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { showNotification } from "../store/slices/notificationSlice"
import api from "../services/apiService"
import { API_ENDPOINTS } from "../config/api"
import Navbar from "../components/Navbar"

function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    companyName: user?.companyName || "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.put(`${API_ENDPOINTS.users}/${user.id}`, formData)
      dispatch(showNotification({ message: "Profile updated successfully!", type: "success" }))
      setIsEditing(false)
    } catch (error) {
      dispatch(showNotification({ message: "Failed to update profile", type: "error" }))
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>

        <div className="glass rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-text-secondary">{user?.email}</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-dark-light hover:bg-dark-border rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
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
                />
              </div>

              {user?.role === "company" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-dark-light hover:bg-dark-border rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Role</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>

                <div>
                  <p className="text-text-secondary text-sm mb-1">Status</p>
                  <p className="font-medium">
                    {user?.isVerified ? (
                      <span className="text-success">Verified</span>
                    ) : (
                      <span className="text-yellow-500">Not Verified</span>
                    )}
                  </p>
                </div>

                {user?.companyName && (
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Company</p>
                    <p className="font-medium">{user.companyName}</p>
                  </div>
                )}

                <div>
                  <p className="text-text-secondary text-sm mb-1">Member Since</p>
                  <p className="font-medium">
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!user?.isVerified && user?.role === "company" && (
          <div className="glass rounded-xl p-6 mt-6 border-l-4 border-yellow-500">
            <h3 className="font-semibold mb-2">Account Verification</h3>
            <p className="text-text-secondary text-sm">
              Your company account is not verified yet. Verified accounts can publish events without admin moderation.
              Contact admin for verification.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
