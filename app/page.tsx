import { Suspense } from "react"
import { RepositoryDashboard } from "@/components/repository-dashboard"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
  languages_url: string // Add languages_url
  languages_breakdown: Record<string, number> | null // Add languages_breakdown
}

async function getRepositories(): Promise<Repository[]> {
  const username = process.env.GITHUB_USERNAME || "octocat"
  const token = process.env.GITHUB_TOKEN

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Repository-Dashboard",
  }

  if (token) {
    headers["Authorization"] = `token ${token}`
  } else {
    console.warn(
      "GITHUB_TOKEN environment variable is not set. API requests might be rate-limited. For better performance, consider adding a GITHUB_TOKEN to your Vercel project.",
    )
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers,
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: Repository[] = await response.json()
    const publicRepos = repos.filter((repo: Repository) => !repo.private)

    // Fetch detailed language breakdown for each public repository
    const reposWithLanguages = await Promise.all(
      publicRepos.map(async (repo) => {
        try {
          const langResponse = await fetch(repo.languages_url, { headers })
          if (!langResponse.ok) {
            console.warn(`Failed to fetch languages for ${repo.name}: ${langResponse.status}`)
            return { ...repo, languages_breakdown: null }
          }
          const languages = await langResponse.json()
          return { ...repo, languages_breakdown: languages }
        } catch (langError) {
          console.error(`Error fetching languages for ${repo.name}:`, langError)
          return { ...repo, languages_breakdown: null }
        }
      }),
    )

    return reposWithLanguages
  } catch (error) {
    console.error("Error fetching repositories:", error)
    return []
  }
}

function LanguageStatsLoading() {
  return (
    <Card className="mb-8 border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
                <Skeleton className="flex-1 h-2 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

async function RepositoryDashboardWrapper() {
  const repositories = await getRepositories()

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No repositories found. Make sure to set your GitHub username in the environment variables.
        </p>
      </div>
    )
  }

  return <RepositoryDashboard repositories={repositories} />
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">My Repositories</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of my open source projects and contributions
          </p>
        </header>

        <Suspense
          fallback={
            <>
              <LanguageStatsLoading />
              <LoadingSkeleton />
            </>
          }
        >
          <RepositoryDashboardWrapper />
        </Suspense>

        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
      </div>
    </div>
  )
}
