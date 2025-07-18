'use client';
import { useState } from "react"
import { Search } from "lucide-react"

export function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <section className="container py-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search for dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input-field"
        />
      </div>
    </section>
  )
}
