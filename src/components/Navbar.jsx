"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/authSlice"
import { showNotification } from "../store/slices/notificationSlice"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(showNotification({ message: "Logged out successfully", type: "success" }))
    navigate("/")
  }

  return (
    <nav className="glass border-b border-dark-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">IT</span>
            </div>
            <span className="text-xl font-bold">IT Events</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-text-secondary hover:text-white transition-colors">
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-text-secondary hover:text-white transition-colors">
                  Dashboard
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-text-secondary hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-text-secondary hover:text-white transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-dark-light hover:bg-dark-border rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-text-secondary hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              className="p-2 rounded-md hover:bg-dark-light transition-colors"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="absolute top-16 right-4 z-50 w-64 bg-dark rounded-lg shadow-lg p-4 md:hidden">
              <nav className="flex flex-col gap-2">
                <Link to="/" className="text-text-secondary hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                  Events
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="text-text-secondary hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    {user?.role === "admin" && (
                      <Link to="/admin" className="text-text-secondary hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                        Admin
                      </Link>
                    )}
                    <Link to="/profile" className="text-text-secondary hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                      Profile
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout() }}
                      className="px-4 py-2 bg-dark-light hover:bg-dark-border rounded-lg transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-4 py-2 text-text-secondary hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
