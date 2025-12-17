"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEvents, updateEvent, deleteEvent } from "../store/slices/eventsSlice"
import { showNotification } from "../store/slices/notificationSlice"
import api from "../services/apiService"
import { API_ENDPOINTS } from "../config/api"
import Navbar from "../components/Navbar"

function AdminPage() {
  const dispatch = useDispatch()
  const { events, loading } = useSelector((state) => state.events)

  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    dispatch(fetchEvents())
    fetchUsers()
  }, [dispatch])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.users)
      setUsers(data)
    } catch (error) {
      console.log("[v0] Error fetching users:", error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleApproveEvent = async (eventId) => {
    const result = await dispatch(updateEvent({ id: eventId, updates: { status: "approved" } }))
    if (updateEvent.fulfilled.match(result)) {
      dispatch(showNotification({ message: "Event approved successfully!", type: "success" }))
    }
  }

  const handleRejectEvent = async (eventId) => {
    const result = await dispatch(deleteEvent(eventId))
    if (deleteEvent.fulfilled.match(result)) {
      dispatch(showNotification({ message: "Event rejected and deleted", type: "success" }))
    }
  }

  const handleVerifyUser = async (userId) => {
    try {
      await api.put(`${API_ENDPOINTS.users}/${userId}`, { isVerified: true })
      dispatch(showNotification({ message: "User verified successfully!", type: "success" }))
      fetchUsers()
    } catch (error) {
      dispatch(showNotification({ message: "Failed to verify user", type: "error" }))
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const result = await dispatch(deleteEvent(eventId))
      if (deleteEvent.fulfilled.match(result)) {
        dispatch(showNotification({ message: "Event deleted successfully", type: "success" }))
      }
    }
  }

  const pendingEvents = events.filter((e) => e.status === "pending")
  const approvedEvents = events.filter((e) => e.status === "approved")
  const companyUsers = users.filter((u) => u.role === "company" && !u.isVerified)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <p className="text-text-secondary text-sm mb-1">Pending Events</p>
            <p className="text-3xl font-bold">{pendingEvents.length}</p>
          </div>

          <div className="glass rounded-xl p-6">
            <p className="text-text-secondary text-sm mb-1">Approved Events</p>
            <p className="text-3xl font-bold">{approvedEvents.length}</p>
          </div>

          <div className="glass rounded-xl p-6">
            <p className="text-text-secondary text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>

          <div className="glass rounded-xl p-6">
            <p className="text-text-secondary text-sm mb-1">Pending Verifications</p>
            <p className="text-3xl font-bold">{companyUsers.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "pending" ? "bg-secondary text-white" : "bg-dark-light text-text-secondary"
            }`}
          >
            Pending Events ({pendingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("all-events")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "all-events" ? "bg-secondary text-white" : "bg-dark-light text-text-secondary"
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "users" ? "bg-secondary text-white" : "bg-dark-light text-text-secondary"
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {activeTab === "pending" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : pendingEvents.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <p className="text-text-secondary">No pending events</p>
              </div>
            ) : (
              pendingEvents.map((event) => (
                <div key={event.id} className="glass rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-text-secondary text-sm mb-2">{event.description}</p>
                      <div className="flex gap-4 text-sm text-text-secondary">
                        <span>Type: {event.type}</span>
                        <span>By: {event.creatorName}</span>
                        <span>Location: {event.location}</span>
                        <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveEvent(event.id)}
                      className="px-4 py-2 bg-success hover:bg-success/90 text-white rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectEvent(event.id)}
                      className="px-4 py-2 bg-error hover:bg-error/90 text-white rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "all-events" && (
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Event</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Creator</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Attendees</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                      </div>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-text-secondary">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-dark-light/50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-text-secondary">{event.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-dark-light rounded text-xs capitalize">{event.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{event.creatorName}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            event.status === "approved"
                              ? "bg-success/20 text-success"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{event.attendees?.length || 0}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-error hover:text-error/80 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "users" && (
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {loadingUsers ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-text-secondary">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-dark-light/50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{user.name}</p>
                        {user.companyName && <p className="text-sm text-text-secondary">{user.companyName}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-dark-light rounded text-xs capitalize">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? (
                          <span className="px-2 py-1 bg-success/20 text-success rounded text-xs">Verified</span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs">
                            Not Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!user.isVerified && user.role === "company" && (
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="text-secondary hover:text-secondary/80 text-sm"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
