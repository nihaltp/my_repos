"use client"

import { useState } from "react"
import { RepositoryGrid } from "@/components/repository-grid"
import { LanguageStats } from "@/components/language-stats"

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
}

interface RepositoryDashboardProps {
  repositories: Repository[]
}

export function RepositoryDashboard({ repositories }: RepositoryDashboardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  return (
    <>
      <LanguageStats
        repositories={repositories}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={setSelectedLanguage}
      />
      <RepositoryGrid repositories={repositories} selectedLanguage={selectedLanguage} />
    </>
  )
}
