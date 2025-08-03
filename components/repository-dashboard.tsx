"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { LanguageStats } from "@/components/language-stats"
import { RepositoryGrid } from "@/components/repository-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string | "All">("All")
  const [sortBy, setSortBy] = useState<"stars" | "forks" | "updated">("stars")

  const allLanguages = useMemo(() => {
    const languages = new Set<string>()
    repositories.forEach((repo) => {
      if (repo.language) {
        languages.add(repo.language)
      }
      if (repo.languages_breakdown) {
        Object.keys(repo.languages_breakdown).forEach((lang) => languages.add(lang))
      }
    })
    return Array.from(languages).sort()
  }, [repositories])

  const filteredAndSortedRepositories = useMemo(() => {
    const filtered = repositories.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesLanguage =
        selectedLanguage === "All" ||
        (repo.language && repo.language === selectedLanguage) ||
        (repo.languages_breakdown && Object.keys(repo.languages_breakdown).includes(selectedLanguage))

      return matchesSearch && matchesLanguage
    })

    filtered.sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count
      }
      if (sortBy === "forks") {
        return b.forks_count - a.forks_count
      }
      if (sortBy === "updated") {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
      return 0
    })

    return filtered
  }, [repositories, searchTerm, selectedLanguage, sortBy])

  return (
    <div className="grid gap-8">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
          aria-label="Search repositories"
        />
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Languages</SelectItem>
            {allLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: "stars" | "forks" | "updated") => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stars">Stars</SelectItem>
            <SelectItem value="forks">Forks</SelectItem>
            <SelectItem value="updated">Last Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LanguageStats
        repositories={filteredAndSortedRepositories}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={setSelectedLanguage}
      />

      <RepositoryGrid repositories={filteredAndSortedRepositories} selectedLanguage={selectedLanguage} />

      {filteredAndSortedRepositories.length === 0 && (
        <p className="text-center text-slate-600 dark:text-slate-400">No repositories match your criteria.</p>
      )}
    </div>
  )
}
