"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { hideNotification } from "../store/slices/notificationSlice"

function Notification() {
  const dispatch = useDispatch()
  const { show, message, type } = useSelector((state) => state.notification)

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification())
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [show, dispatch])

  if (!show) return null

  const bgColor = type === "success" ? "bg-success" : type === "error" ? "bg-error" : "bg-accent"

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-md`}>
        <div className="flex items-center gap-3">
          {type === "success" && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === "error" && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Notification
