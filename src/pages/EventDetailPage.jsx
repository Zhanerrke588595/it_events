"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchEventById, bookEvent, clearCurrentEvent, deleteEvent } from "../store/slices/eventsSlice"
import { showNotification } from "../store/slices/notificationSlice"
import { addBooking } from "../store/slices/bookingsSlice" // <-- импортируем bookingsSlice
import Navbar from "../components/Navbar"
import CreateEventModal from "../components/CreateEventModal"

function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [booking, setBooking] = useState(false)

  const { currentEvent, loading } = useSelector((state) => state.events)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchEventById(id))

    return () => {
      dispatch(clearCurrentEvent())
    }
  }, [id, dispatch])

  const handleBooking = async () => {
    if (!isAuthenticated) {
      dispatch(showNotification({ message: "Please login to register for events", type: "error" }))
      navigate("/login")
      return
    }

    setBooking(true)
    try {
      const result = await dispatch(bookEvent({ eventId: id, userId: user.id }))

      if (bookEvent.fulfilled.match(result)) {
        // Успешная регистрация
        dispatch(showNotification({ message: "Successfully registered for event!", type: "success" }))

        // Добавляем запись в bookings
        dispatch(addBooking({
          eventId: id,
          userId: user.id,
          userName: user.name,
          eventTitle: currentEvent.title,
          date: currentEvent.date
        }))
      } else {
        dispatch(showNotification({ message: result.payload || "Booking failed", type: "error" }))
      }
    } finally {
      setBooking(false)
    }
  }

  if (loading || !currentEvent) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </div>
    )
  }

  const isRegistered = currentEvent.attendees?.includes(user?.id)
  const isFull = currentEvent.maxAttendees && currentEvent.attendees?.length >= currentEvent.maxAttendees

  const eventDate = new Date(currentEvent.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const typeColors = {
    meetup: "bg-accent text-white",
    hackathon: "bg-secondary text-white",
    webinar: "bg-success text-white",
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="glass rounded-2xl p-8">

          <div className="h-64 w-full overflow-hidden rounded-2xl mb-6">
            <a href={currentEvent.img || "/igm/placeholder.jpg"} target="_blank" rel="noopener noreferrer">
              <img
                src={currentEvent.img || "/igm/placeholder.jpg"}
                alt={currentEvent.title}
                onError={(e) => { e.target.onerror = null; console.warn("Image load failed:", e.target.src); e.target.src = "/igm/placeholder.jpg" }}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          <div className="flex items-start justify-between mb-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${typeColors[currentEvent.type] || typeColors.meetup}`}
            >
              {currentEvent.type}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{currentEvent.title}</h1>

          <div className="flex flex-wrap gap-6 mb-8 text-text-secondary">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </div>

            {currentEvent.time && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{currentEvent.time}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{currentEvent.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>
                {currentEvent.attendees?.length || 0}
                {currentEvent.maxAttendees && ` / ${currentEvent.maxAttendees}`} registered
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">About this event</h2>
            <p className="text-text-secondary leading-relaxed">{currentEvent.description}</p>
          </div>

          <div className="border-t border-dark-border pt-6 mb-8">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Organized by</h3>
            <p className="text-lg font-semibold">{currentEvent.creatorName}</p>

            {(user?.id === currentEvent.creatorId || user?.role === "admin") && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-dark-light hover:bg-dark-border rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return
                    const res = await dispatch(deleteEvent(id))
                    if (deleteEvent.fulfilled.match(res)) {
                      dispatch(showNotification({ message: "Event deleted", type: "success" }))
                      navigate("/")
                    } else {
                      dispatch(showNotification({ message: res.payload || "Failed to delete event", type: "error" }))
                    }
                  }}
                  className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {currentEvent.status !== "approved" ? (
            <div className="bg-yellow-50 text-yellow-700 px-6 py-4 rounded-lg font-semibold text-center">
              This event is pending approval and cannot be registered yet
            </div>
          ) : isRegistered ? (
            <div className="bg-success/20 text-success px-6 py-4 rounded-lg font-semibold text-center">
              You are registered for this event
            </div>
          ) : isFull ? (
            <div className="bg-error/20 text-error px-6 py-4 rounded-lg font-semibold text-center">
              This event is full
            </div>
          ) : (
            <button
              onClick={handleBooking}
              disabled={booking || isRegistered || isFull}
              aria-busy={booking}
              className={`w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 rounded-lg transition-colors ${booking ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {booking ? "Registering..." : "Register for Event"}
            </button>
          )}

          {/* Edit modal for event organizer/admin */}
          <CreateEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            initialData={currentEvent}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage
