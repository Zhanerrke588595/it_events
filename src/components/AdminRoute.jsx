import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
