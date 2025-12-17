"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEvents, setFilters } from "../store/slices/eventsSlice"
import Navbar from "../components/Navbar"
import EventCard from "../components/EventCard"
import CreateEventModal from "../components/CreateEventModal"
import Pagination from "../components/Pagination"

function EventsPage() {
  const dispatch = useDispatch()
  const { events, loading, filters } = useSelector((state) => state.events)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }))
  }

  const handleTypeFilter = (type) => {
    dispatch(setFilters({ type }))
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description?.toLowerCase().includes(filters.search.toLowerCase())

    const matchesType = filters.type === "all" || event.type === filters.type
    const matchesStatus = event.status === "approved"

    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  // clamp page in case filters change
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [filters.search, filters.type, totalPages])

  const startIndex = (page - 1) * pageSize
  const pagedEvents = filteredEvents.slice(startIndex, startIndex + pageSize)
  const previewItems = filteredEvents.slice(startIndex + pageSize, startIndex + pageSize + 3) // small preview of next page

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-balance">Discover IT Events in Kazakhstan</h1>
          <p className="text-xl text-text-secondary">Join meetups, hackathons, and webinars in the tech community</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 bg-dark-light border border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {isAuthenticated && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-4 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl transition-colors"
            >
              Create Event
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {["all", "meetup", "hackathon", "webinar"].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filters.type === type
                  ? "bg-secondary text-white"
                  : "bg-dark-light text-text-secondary hover:bg-dark-border"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">No events found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
              previewItems={previewItems}
            />
          </>
        )}
      </div>

      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default EventsPage
