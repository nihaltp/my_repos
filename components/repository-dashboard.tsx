"use client"

import { useState } from "react"
import { RepositoryGrid } from "@/components/repository-grid"
import { LanguageStats } from "@/components/language-stats"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

interface Contributor {
  login: string
  avatar_url: string
  html_url: string
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  topics: string[]
  private: boolean
  languages_url: string
  languages_breakdown: Record<string, number> | null
  contributors_url: string
  contributors: Contributor[] | null
}

interface RepositoryDashboardProps {
  repositories: Repository[]
}

export function RepositoryDashboard({ repositories }: RepositoryDashboardProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]) // Changed to array
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguages((prevSelected) => {
      if (prevSelected.includes(language)) {
        return prevSelected.filter((lang) => lang !== language) // Deselect
      } else {
        return [...prevSelected, language] // Select
      }
    })
  }

  const filteredRepositories = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLanguage =
      selectedLanguages.length === 0 || // If no languages are selected, show all
      (repo.language && selectedLanguages.includes(repo.language)) ||
      (repo.languages_breakdown &&
        Object.keys(repo.languages_breakdown).some((lang) => selectedLanguages.includes(lang)))

    return matchesSearch && matchesLanguage
  })

  return (
    <>
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          placeholder="Search repositories by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          aria-label="Search repositories"
        />
      </div>
      <LanguageStats
        repositories={repositories}
        selectedLanguages={selectedLanguages} // Pass array
        onLanguageSelect={handleLanguageSelect} // Pass new handler
      />
      <RepositoryGrid repositories={filteredRepositories} selectedLanguages={selectedLanguages} />
    </>
  )
}
