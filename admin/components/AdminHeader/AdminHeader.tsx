"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface AdminHeaderProps {
  onSearch?: (query: string) => void
  onCreateClick?: () => void
}

export default function AdminHeader({ onSearch, onCreateClick }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <header className="bg-white border-b border-surface shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-surface rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={onCreateClick}
        className="cursor-pointer ml-4 px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors"
      >
        Tạo
      </button>
    </header>
  )
}
