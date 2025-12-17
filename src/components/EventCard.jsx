import { Link } from "react-router-dom"

function EventCard({ event }) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const typeColors = {
    meetup: "bg-accent text-white",
    hackathon: "bg-secondary text-white",
    webinar: "bg-success text-white",
  }

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="glass rounded-xl p-6 hover:border-secondary transition-all">

        <div className="h-48 w-full overflow-hidden rounded-xl mb-4">
          <img
            src={event.img || "/images/placeholder.jpg"}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex items-start justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[event.type] || typeColors.meetup}`}
          >
            {event.type}
          </span>
          {event.status === "pending" && (
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-semibold">
              Pending
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-secondary transition-colors">{event.title}</h3>

        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{event.attendees?.length || 0} registered</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-dark-border">
          <p className="text-xs text-text-secondary">
            By {event.creatorName} • {event.location}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
