import React from "react"

export default function Pagination({ currentPage, totalPages, onPageChange, previewItems = [] }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="px-4 py-2 bg-dark-light rounded-lg hover:bg-dark-border disabled:opacity-50"
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="flex items-center gap-2">
        {start > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-lg ${currentPage === 1 ? "bg-secondary text-white" : "bg-dark-light text-text-secondary hover:bg-dark-border"}`}
          >
            1
          </button>
        )}

        {start > 2 && <span className="text-text-secondary">...</span>}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-lg ${currentPage === p ? "bg-secondary text-white" : "bg-dark-light text-text-secondary hover:bg-dark-border"}`}
          >
            {p}
          </button>
        ))}

        {end < totalPages - 1 && <span className="text-text-secondary">...</span>}

        {end < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? "bg-secondary text-white" : "bg-dark-light text-text-secondary hover:bg-dark-border"}`}
          >
            {totalPages}
          </button>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="px-4 py-2 bg-dark-light rounded-lg hover:bg-dark-border disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>

        {previewItems && previewItems.length > 0 && (
          <div className="absolute right-0 -bottom-40 w-72 bg-dark-light border border-dark-border rounded-lg p-3 hidden group-hover:block transition-opacity pointer-events-none z-50">
            <h4 className="text-sm font-semibold mb-2">Preview (next page)</h4>
            <ul className="text-sm text-text-secondary space-y-1 max-h-48 overflow-auto">
              {previewItems.map((it, idx) => (
                <li key={idx} className="truncate">{it.title || it}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
