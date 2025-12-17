"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createEvent, updateEvent } from "../store/slices/eventsSlice"
import { showNotification } from "../store/slices/notificationSlice"

function CreateEventModal({ isOpen, onClose, initialData = null, isEdit = false }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "meetup",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
    img: "",
  })
  const fileInputRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isKeeping, setIsKeeping] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    if (isEdit && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "meetup",
        date: initialData.date || "",
        time: initialData.time || "",
        location: initialData.location || "",
        maxAttendees: initialData.maxAttendees || "",
        img: initialData.img || "",
      })
    } else if (!isEdit) {
      setFormData({
        title: "",
        description: "",
        type: "meetup",
        date: "",
        time: "",
        location: "",
        maxAttendees: "",
        img: "",
      })
    }
  }, [isOpen, isEdit, initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      dispatch(showNotification({ message: "Please fill in all required fields", type: "error" }))
      return
    }

    setIsSubmitting(true)
    try {
      if (isEdit && initialData) {
        const updates = { ...initialData, ...formData }
        const result = await dispatch(updateEvent({ id: initialData.id, updates }))
        if (updateEvent.fulfilled.match(result)) {
          dispatch(showNotification({ message: "Event updated successfully!", type: "success" }))
          onClose()
        } else {
          dispatch(showNotification({ message: result.payload || "Update failed", type: "error" }))
        }
        return
      }

      const result = await dispatch(createEvent(formData))
      if (createEvent.fulfilled.match(result)) {
        const message =
          user?.role === "admin" || user?.isVerified ? "Event created successfully!" : "Event submitted for moderation"
        dispatch(showNotification({ message, type: "success" }))
        onClose()
        setFormData({
          title: "",
          description: "",
          type: "meetup",
          date: "",
          time: "",
          location: "",
          maxAttendees: "",
          img: "",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeep = async (e) => {
    if (e && e.preventDefault) e.preventDefault()

    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      dispatch(showNotification({ message: "Please fill in all required fields", type: "error" }))
      return
    }

    setIsKeeping(true)
    try {
      if (isEdit && initialData) {
        const updates = { ...initialData, ...formData }
        const result = await dispatch(updateEvent({ id: initialData.id, updates }))
        if (updateEvent.fulfilled.match(result)) {
          dispatch(showNotification({ message: "Event saved", type: "success" }))
        } else {
          dispatch(showNotification({ message: result.payload || "Save failed", type: "error" }))
        }
        return
      }

      const result = await dispatch(createEvent(formData))
      if (createEvent.fulfilled.match(result)) {
        const message =
          user?.role === "admin" || user?.isVerified ? "Event saved" : "Event submitted for moderation"
        dispatch(showNotification({ message, type: "success" }))
      } else {
        dispatch(showNotification({ message: result.payload || "Save failed", type: "error" }))
      }
    } finally {
      setIsKeeping(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSizeMB = 2
    if (file.size > maxSizeMB * 1024 * 1024) {
      dispatch(showNotification({ message: `Image must be <= ${maxSizeMB} MB`, type: "error" }))
      e.target.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, img: reader.result }))
    }
    reader.onerror = () => {
      dispatch(showNotification({ message: "Failed to read image file", type: "error" }))
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, img: "" }))
    if (fileInputRef.current) fileInputRef.current.value = null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 transition-opacity duration-200">
      <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{isEdit ? "Edit Event" : "Create Event"}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="React Meetup Almaty"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Describe your event..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Image (optional)</label>

            {formData.img ? (
              <div className="flex items-start gap-4">
                <img src={formData.img} alt="Preview" className="w-28 h-20 object-cover rounded-lg border border-dark-border" />
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-dark-light hover:bg-dark-border rounded-lg transition-colors text-sm"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-dark-light hover:bg-dark-border rounded-lg transition-colors"
                >
                  Upload Image
                </button>
                <p className="text-text-secondary text-sm">Optional. JPG/PNG, ≤ 2MB</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="meetup">Meetup</option>
                <option value="hackathon">Hackathon</option>
                <option value="webinar">Webinar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Attendees</label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-light border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Almaty, Kazakhstan"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-light hover:bg-dark-border rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleKeep}
              disabled={isKeeping || isSubmitting}
              className={`flex-1 px-6 py-3 bg-dark-light hover:bg-dark-border rounded-lg transition-colors ${isKeeping || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isKeeping ? 'Saving...' : 'Keep'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isKeeping}
              className={`flex-1 px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors ${isSubmitting || isKeeping ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEventModal
