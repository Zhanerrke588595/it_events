"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchEvents } from "../store/slices/eventsSlice"
import Navbar from "../components/Navbar"
import EventCard from "../components/EventCard"
import CreateEventModal from "../components/CreateEventModal"

function DashboardPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { events, loading } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("registered")

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const registeredEvents = events.filter((event) => event.attendees?.includes(user?.id) && event.status === "approved")

  const myEvents = events.filter((event) => event.creatorId === user?.id)

  const pendingEvents = myEvents.filter((event) => event.status === "pending")

  const displayEvents = activeTab === "registered" ? registeredEvents : activeTab === "my-events" ? myEvents : []

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-text-secondary">Welcome back, {user?.name}</p>
        </div>

        {pendingEvents.length > 0 && (
          <div className="glass rounded-xl p-6 mb-8 border-l-4 border-yellow-500">
            <h3 className="font-semibold mb-2">Pending Events</h3>
            <p className="text-text-secondary text-sm">
              You have {pendingEvents.length} event{pendingEvents.length > 1 ? "s" : ""} waiting for admin approval
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Registered Events</p>
                <p className="text-3xl font-bold">{registeredEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">My Events</p>
                <p className="text-3xl font-bold">{myEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Pending Approval</p>
                <p className="text-3xl font-bold">{pendingEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("registered")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "registered" ? "bg-secondary text-white" : "bg-dark-light text-text-secondary"
              }`}
            >
              Registered Events
            </button>
            <button
              onClick={() => setActiveTab("my-events")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "my-events" ? "bg-secondary text-white" : "bg-dark-light text-text-secondary"
              }`}
            >
              My Events
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors"
          >
            Create Event
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-20 glass rounded-xl">
            <p className="text-text-secondary text-lg mb-4">No events found</p>
            {activeTab === "registered" && (
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors"
              >
                Browse Events
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default DashboardPage
